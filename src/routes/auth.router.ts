import express, { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import {
  forgotPassword,
  getUserProfile,
  login,
  LoginWithLink,
  ResetPassword,
  sendLoginLink,
  signUp,
  updateProfile,
  verifyProfile,
} from "../controllers/accounts.controller";
import forgotPasswordSchema from "../validations/forgotPassword.schema";
import signupSchema from "../validations/signup.schema";
import loginSchema from "../validations/login.schema";
import updateProfileSchema from "../validations/updateProfile.schema";
import verifyProfileSchema from "../validations/verifyProfile.schema";
import setPasswordSchema from "../validations/setPassword.schema";
import authenticate from "../utils/authenticate";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/docs");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  },
});

const authRouter: Router = express.Router();

authRouter.get("/", (req: Request, res: Response) => {
  res.send("ZPlatform Server is running.");
});

const uploadDocs = multer({ storage });

authRouter
  .post("/signup", signupSchema, signUp)
  .post("/login", loginSchema, login)
  .post("/reset-password", forgotPasswordSchema, forgotPassword)
  .post(
    "/update-profile",
    updateProfileSchema,
    uploadDocs.single("documentAttachment"),
    updateProfile
  )
  .post("/verify-profile", verifyProfileSchema, verifyProfile)
  .post("/send-login-link", forgotPasswordSchema, sendLoginLink)
  .post("/set-password", setPasswordSchema, ResetPassword)
  .post("/login-with-link/:token", LoginWithLink)
  .get("/profile", authenticate, getUserProfile);

authRouter.get("/media/:file(*)", (req, res) => {
  const { file } = req.params;
  res.sendFile(path.join(path.dirname(path.dirname(__dirname)), `${file}`));
});

export default authRouter;
