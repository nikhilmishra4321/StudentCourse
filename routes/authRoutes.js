
const authController = require('../controllers/authController');

const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.render('login', { message: '' });
});
router.get('/register', authController.getRegister);
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.get('/login', authController.getLogin);
router.post('/login', authController.login);
module.exports = router;
