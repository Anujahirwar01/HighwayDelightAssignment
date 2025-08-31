import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import userModel from '../models/user.model';
import { sendOTPEmail } from '../services/user.service';
const { validationResult } = require('express-validator');

export const generateToken = (userId: string) => {
  const payload = { id: userId };
  const secret = process.env.JWT_SECRET || 'your_jwt_secret';
  const options = { expiresIn: '1h' as const };
  return jwt.sign(payload, secret, options);
};

const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email, name, age } = req.body;

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Send OTP email (this will validate email and check if user exists)
    await sendOTPEmail(email, otp, 'signup');

    // Create user only after successful email validation
    const user = await userModel.create({
      email,
      name,
      age,
      otp,
      otpExpiry,
      isVerified: false
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully. Please check your email for OTP verification.',
      data: {
        userId: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific validation errors from service layer
    if (error instanceof Error) {
      if (error.message.includes("Invalid email format") ||
          error.message.includes("already exists")) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
      return;
    }

    // Find user with OTP
    const user = await userModel.findOne({
      email,
      otp,
      otpExpiry: { $gt: Date.now() }
    }).select('+otp +otpExpiry');

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
      return;
    }

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate token
    const token = generateToken((user._id as string).toString());

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          age: user.age,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email } = req.body;

    // Generate OTP for login
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Send OTP email (this will validate email exists and is verified)
    await sendOTPEmail(email, otp, 'login');

    // Update user with OTP only after successful email validation
    const user = await userModel.findOne({ email });
    if (user) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email successfully. Please verify to login.',
      data: {
        email: user?.email,
        name: user?.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific validation errors from service layer
    if (error instanceof Error) {
      if (error.message.includes("No account found") ||
          error.message.includes("Invalid email format") ||
          error.message.includes("verify your email first")) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error sending login OTP'
    });
  }
};

export const verifyLoginOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
      return;
    }

    // Find user with OTP
    const user = await userModel.findOne({
      email,
      otp,
      otpExpiry: { $gt: Date.now() }
    }).select('+otp +otpExpiry');

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
      return;
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate token
    const token = generateToken((user._id as string).toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          age: user.age,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    console.error('Login OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying login OTP'
    });
  }
};

export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({
        success: false,
        message: 'User is already verified'
      });
      return;
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, 'resend');

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP'
    });
  }
};