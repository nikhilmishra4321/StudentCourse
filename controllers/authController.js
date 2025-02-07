
const generateOTP = require('../utils/otpGenerator');
const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
exports.getHome = (req, res) => {
  res.render('home', { user: req.session.user || null });
};
exports.getRegister = (req, res) => {
  res.render('register', { message: null });
};
exports.register = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    return res.render('register', {message: 'User already exists'});
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user = new User({ email, password: hashedPassword, isVerified: false });
  await user.save();
  const otp = generateOTP();
  await OTP.create({ email, otp });
  await sendEmail(email, `Your OTP is: ${otp}`);
  res.render('otp', { email, message: 'OTP  is sent to your email' });
};
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const otpRecord = await OTP.findOne({ email, otp });
  if (!otpRecord) {
    return res.render('otp', { email, message: 'Invalid and expired OTP' });
  }
  await User.updateOne({ email }, { isVerified: true });
  await OTP.deleteMany({ email });
  res.redirect('/login');
};
exports.getLogin = (req, res) => {
  res.render('login', { message: null });
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.render('login', { message: 'Email is not verified' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    return res.redirect('/home');
  } catch (err) {
    console.error('Error during login:', err.message);
    return res.render('login', { message: ' error' });
  }
};
