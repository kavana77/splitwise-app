import nodemailer from 'nodemailer'
import env from './validation'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
    }
})
export const sendEmail = async (to: string, subject: string, text: string, html?: string)=>{
    const mailOptions = {
        from: `Splitwise <${env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    }
    await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${to} with subject: ${subject}`);
}