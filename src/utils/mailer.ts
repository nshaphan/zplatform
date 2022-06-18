import nodemailer from "nodemailer";
import config from "../config";

interface EmailOptions {
  to: string;
  subject: string;
  message: string;
  title: string;
}
const sendMail = ({ title, to, subject, message }: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASS,
    },
  });

  const mailOptions = {
    to,
    subject,
    from: "noreply@zplatform.com",
    html: `<h1>${title}</h1><p>${message}</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

export default sendMail;
