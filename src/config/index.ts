import dotenv from "dotenv";

dotenv.config();

export default {
  JWT_SECRET: process.env.JWT_SECRET || "",
  MAIL_USER: process.env.MAIL_USER || "",
  MAIL_PASS: process.env.MAIL_PASS || "",
  FRONTEND_HOST: process.env.FRONTEND_HOST || "",
};
