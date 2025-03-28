"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeMailer = nodeMailer;
const nodemailer_1 = __importDefault(require("nodemailer"));
function nodeMailer(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default === null || nodemailer_1.default === void 0 ? void 0 : nodemailer_1.default.createTransport({
            service: "Gmail",
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.NODE_MAILER_EMAIL,
                pass: process.env.NODE_MAILER_PASS,
            },
        });
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL,
            to: email,
            subject: "Your OTP Verification Code-MentorPlus",
            text: `Your OTP code is ${otp}. It is valid for the next 5 minutes.`,
            html: `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #ff8800;text-decoration:none;font-weight:600"></a>Mentor Plus
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Mentor Plus. Use the following OTP to complete your Sign Up procedures. OTP is valid for 2 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />Mentor Plus</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Mentor Plus</p>
      <p>Amphitheatre Parkway</p>
      <p>calicut</p>
    </div>
  </div>
</div>`,
        };
        yield (transporter === null || transporter === void 0 ? void 0 : transporter.sendMail(mailOptions));
    });
}
