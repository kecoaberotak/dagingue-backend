import nodemailer from 'nodemailer';
import CONFIG from '../config/environtment';
import { logInfo } from './logger';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CONFIG.emailUser,
    pass: CONFIG.emailPassword,
  },
});

export const sendVerificationEmail = async (toEmail: string, verificationLink: string) => {
  const mailOption = {
    from: CONFIG.emailUser,
    to: toEmail,
    subject: 'Email Verification',
    text: `Click on the following link to verify your email: ${verificationLink}`,
    html: `<p>Click on the following link to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`,
  };

  await transporter.sendMail(mailOption);
  logInfo(`Verification email sent to: ${toEmail}`);
};
