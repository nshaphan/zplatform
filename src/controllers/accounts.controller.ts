import {
  DocumentType,
  User,
  Status,
  MaritalStatus,
  Gender,
} from "@prisma/client";
import bcrypt from "bcrypt";
import { randomInt } from "crypto";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import config from "../config";
import {
  changeStatus,
  createUserProfile,
  findUserByEmail,
  findUserById,
  ForgotPasswordInput,
  generateLoginLink,
  LoginInput,
  revokeLoginLink,
  revokeOtpCode as revokeOtp,
  setOtp,
  setPassword,
  updateUserProfile,
  UserProfileInput,
} from "../services/accounts.service";
import { signToken, verifyToken } from "../utils/jwtHelper";
import sendMail from "../utils/mailer";

interface ProfileResponse {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id?: number;
      profilePhoto?: string;
      firstName?: string;
      lastName?: string;
      gender?: Gender;
      age?: number;
      dateOfBirth?: string;
      maritalStatus?: MaritalStatus;
      nationality?: string;
      email?: string;
      status?: Status;
      documentType?: DocumentType;
      idNumber?: string;
      documentAttachment?: string;
      isVerification?: boolean;
    };
  };
}

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
    success: true,
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
  let user = await findUserByEmail(input.email);
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

  let token = "";
  let otpCode = "";
  if (!user.isTwoFactorEnabled) {
    token = signToken(user, "24h");
  } else {
    otpCode = randomInt(10000, 99999).toString();
    const otpCodeHash = bcrypt.hashSync(otpCode, 10);
    user = await setOtp(user.id, otpCodeHash);
    sendMail({
      title: "Two Factor Authentication",
      to: input.email,
      subject: "ZPlatform - OTP Code",
      message: `Your OTP Code is: ${otpCode}, will expire in 5 minutes`,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      },
      ...(!user.isTwoFactorEnabled && { token }),
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
    title: "Reset Password",
    to: input.email,
    subject: "ZPlatform - Reset Password",
    message: `Click here to reset password: ${config.FRONTEND_HOST}/reset-password/${token}`,
  });
  // send email
  return res.status(201).json({
    success: true,
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

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
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
    success: true,
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
    title: "Login Link",
    to: input.email,
    subject: "ZPlatform - Login Link",
    message: `Click here to Login: ${config.FRONTEND_HOST}/login-link/${user.loginLinkToken}`,
  });
  // send email
  return res.status(201).json({
    success: true,
    message: "Login link email sent successfully, check your email.",
  });
};

const LoginWithLink = async (
  req: Request<{ token: string }, Record<string, never>, Record<string, never>>,
  res: Response
) => {
  const input = req.params;
  const data = await verifyToken(input.token);

  if (data.error) {
    return res.status(401).json({
      success: false,
      message: "The link is either invalid or expired",
    });
  }

  const user = await revokeLoginLink(data.id || 0);

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

const ResetPassword = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    { password: string; token: string }
  >,
  res: Response
) => {
  const input = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = await verifyToken(input.token);
  console.log(input.token);

  if (data.error) {
    return res.status(401).json({
      success: false,
      message: "The link is either invalid or expired",
    });
  }

  await setPassword(data.id || 0, input.password);
  return res.status(201).json({
    success: true,
    message: "Password reset successfully",
  });
};

const getUserProfile = (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    Record<string, never>
  >,
  res: Response<ProfileResponse, { user: User }>
) => {
  const { user } = res.locals;

  return res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: {
      user: {
        id: user.id,
        profilePhoto: user.profilePhoto || "",
        firstName: user.firstName,
        lastName: user.firstName,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        maritalStatus: user.maritalStatus,
        nationality: user.nationality,
        email: user.email,
        status: user.status || null || undefined,
        documentAttachment: user.documentAttachment || "",
        idNumber: user.idNumber || "",
      },
    },
  });
};

const verifyOtp = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    { id: number; otpCode: string }
  >,
  res: Response
) => {
  const input = req.body;
  const user = await findUserById(input.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid Code",
    });
  }

  if (user?.otpExpiresAt && user?.otpExpiresAt < new Date()) {
    return res.status(401).json({
      success: false,
      message: "Invalid Code",
    });
  }

  if (!bcrypt.compareSync(input.otpCode, user.otpToken || "")) {
    return res.status(401).json({
      success: false,
      message: "Invalid Code",
    });
  }

  const token = signToken(user, "24h");
  await revokeOtp(user.id);

  return res.status(200).json({
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

export {
  signUp,
  login,
  forgotPassword,
  updateProfile,
  verifyProfile,
  sendLoginLink,
  LoginWithLink,
  ResetPassword,
  getUserProfile,
  verifyOtp,
};
