"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    JWT_SECRET: process.env.JWT_SECRET || "",
    MAIL_USER: process.env.MAIL_USER || "",
    MAIL_PASS: process.env.MAIL_PASS || "",
    FRONTEND_HOST: process.env.FRONTEND_HOST || "",
};
