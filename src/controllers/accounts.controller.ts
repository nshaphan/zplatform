import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import config from "../config";
import {
  changeStatus,
  createUserProfile,
  findUserByEmail,
  ForgotPasswordInput,
  generateLoginLink,
  LoginInput,
  revokeLoginLink,
  setPassword,
  updateUserProfile,
  UserProfileInput,
} from "../services/accounts.service";
import { signToken, verifyToken } from "../utils/jwtHelper";
import sendMail from "../utils/mailer";

const signUp = async (
  req: Request<Record<string, never>, Record<string, never>, UserProfileInput>,
  res: Response
): Promise<Response> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const user = await createUserProfile(req.body);

  return res.status(201).json({
    status: true,
    message: "Profile created successfully",
    data: {
      id: user.id,
    },
  });
};

const login = async (
  req: Request<Record<string, never>, Record<string, never>, LoginInput>,
  res: Response
): Promise<Response> => {
  const input = req.body;
  const user = await findUserByEmail(input.email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Incorrect credentials",
    });
  }

  if (!bcrypt.compareSync(input.password, user.password)) {
    return res.status(401).json({
      success: false,
      message: "Incorrect credentials",
    });
  }

  const token = signToken(user, "24h");

  return res.status(201).json({
    success: true,
    message: "Logged in successfully",
    data: {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    },
  });
};

const forgotPassword = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    ForgotPasswordInput
  >,
  res: Response
) => {
  const input = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const user = await findUserByEmail(input.email);
  const token = signToken(user, "15m");
  sendMail({
    to: input.email,
    subject: "ZPlatform - Reset Password",
    message: `Click here to reset password: ${config.FRONTEND_HOST}/reset-password/${token}`,
  });
  // send email
  return res.status(201).json({
    status: "success",
    message: "Password email sent successfully, check your email.",
  });
};

const updateProfile = async (
  req: Request<Record<string, never>, Record<string, never>, UserProfileInput>,
  res: Response
) => {
  const input = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await updateUserProfile({
    ...input,
    documentAttachment: req.file?.path || "",
  });

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return res.status(201).json({
    status: "success",
    message: "Profile created successfully",
    data: {
      id: Number(user.id),
    },
  });
};

const verifyProfile = async (req: Request, res: Response) => {
  const input = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await changeStatus(input.id, input.status);

  return res.status(201).json({
    status: "success",
    message: "Profile created successfully",
    data: {
      id: Number(user.id),
    },
  });
};

const sendLoginLink = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    ForgotPasswordInput
  >,
  res: Response
) => {
  const input = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await generateLoginLink(input.email);

  sendMail({
    to: input.email,
    subject: "ZPlatform - Login Link",
    message: `Click here to Login: ${config.FRONTEND_HOST}/login-link/${user.loginLinkToken}`,
  });
  // send email
  return res.status(201).json({
    status: "success",
    message: "Login link email sent successfully, check your email.",
  });
};

const LoginWithLink = async (
  req: Request<Record<string, never>, Record<string, never>, { token: string }>,
  res: Response
) => {
  const input = req.body;
  const data = await verifyToken(input.token);
  if (data.error) {
    return res.status(401).json({
      status: "unAuthorized",
      message: "The link is either invalid or expired",
    });
  }

  const user = await revokeLoginLink(data.id || 0);

  const token = signToken(user, "24h");

  return res.status(201).json({
    status: "success",
    message: "Logged in successfully",
    data: {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    },
  });
};

const ResetPassword = async (
  req: Request<{ token: string }, Record<string, never>, { password: string }>,
  res: Response
) => {
  const input = req.body;
  const { params } = req;
  const data = await verifyToken(params.token);
  if (data.error) {
    return res.status(401).json({
      status: "unAuthorized",
      message: "The link is either invalid or expired",
    });
  }

  await setPassword(data.id || 0, input.password);
  return res.status(201).json({
    status: "success",
    message: "Password reset successfully",
  });
};

export {
  signUp,
  login,
  forgotPassword,
  updateProfile,
  verifyProfile,
  sendLoginLink,
  LoginWithLink,
  ResetPassword,
};
