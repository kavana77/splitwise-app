"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const validation_1 = __importDefault(require("./validation"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: validation_1.default.EMAIL_USER,
        pass: validation_1.default.EMAIL_PASS
    }
});
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: `Splitwise <${validation_1.default.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} with subject: ${subject}`);
};
exports.sendEmail = sendEmail;
