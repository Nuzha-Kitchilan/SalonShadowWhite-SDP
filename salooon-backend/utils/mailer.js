const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false 
  }
});

const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Salon" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset OTP',
    html: `
      <h3>Reset Your Password</h3>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>It is valid for 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
