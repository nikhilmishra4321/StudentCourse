const nodemailer = require('nodemailer');
require('dotenv').config();
const sendEmail = async (email, otp, subject = 'OTP for Verification') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS   
    }
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: `Your OTP  is: ${otp}`
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
module.exports = sendEmail;
