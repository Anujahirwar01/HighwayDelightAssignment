import express from 'express';
const { body } = require('express-validator');
import { signup, verifyOTP, login, verifyLoginOTP, resendOTP } from '../controllers/user.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Validation rules
const signupValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('age')
    .isInt({ min: 10, max: 120 })
    .withMessage('Age must be between 10 and 120')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const otpValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be 6 digits')
];

const googleAuthValidation = [
  body('token')
    .notEmpty()
    .withMessage('Google token is required')
];

// Routes
router.post('/signup', signupValidation, signup);
router.post('/verify-otp', otpValidation, verifyOTP);
router.post('/login', loginValidation, login);
router.post('/verify-login-otp', otpValidation, verifyLoginOTP);
// router.post('/google', googleAuthValidation, googleAuth);
router.post('/resend-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], resendOTP);

// Protected routes
// router.get('/me', protect, getMe);

export default router;