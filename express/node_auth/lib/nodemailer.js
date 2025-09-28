import nodemailer from "nodemailer";

// const testAccount = await nodemailer.createTestAccount();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "thelma.hauck@ethereal.email",
    pass: "BHHSVqrpR7CfB7mAEj",
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `'URL SHORTENER' <thelma.hauck@ethereal.email>`,
    to,
    subject,
    html,
  });

  const testEmailUrl = nodemailer.getTestMessageUrl(info);
  console.log("verify Email: ", testEmailUrl);
};
