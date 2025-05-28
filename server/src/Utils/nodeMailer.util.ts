import nodemailer from "nodemailer";
import { ImailOption } from "../Types";

const transporter = nodemailer?.createTransport({
  service: "Gmail",
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASS,
  },
});

export async function sendMail(options:ImailOption) {
  const mailOptions={
    from:process.env.NODE_MAILER_EMAIL,
    ...options,
  }
  await transporter.sendMail(mailOptions)
} 
