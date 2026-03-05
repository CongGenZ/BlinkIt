import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendEmailNodemailer = async ({ sendTo, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: sendTo,
      subject: subject,
      html: html,
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.log(error);
  }};
export default sendEmailNodemailer;