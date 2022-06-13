"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendMail = ({ to, subject, message }) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: config_1.default.MAIL_USER,
            pass: config_1.default.MAIL_PASS,
        },
    });
    const mailOptions = {
        to,
        subject,
        from: "noreply@zplatform.com",
        html: `<h1>Reset Password</h1><p>${message}</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log(`Email sent: ${info.response}`);
        }
    });
};
exports.default = sendMail;
