import nodemailer from "nodemailer";
import userModel from "../models/user.model";

// Email validation function
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if email exists in database (for login)
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const user = await userModel.findOne({ email });
    return !!user;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
};

// Check if user is verified
export const checkUserVerified = async (email: string): Promise<boolean> => {
  try {
    const user = await userModel.findOne({ email });
    return user ? user.isVerified : false;
  } catch (error) {
    console.error("Error checking user verification:", error);
    return false;
  }
};

// Send OTP email with additional validations
export const sendOTPEmail = async (to: string, otp: string, purpose: 'signup' | 'login' | 'resend' = 'signup'): Promise<void> => {
  try {
    // Validate email format first
    if (!isValidEmail(to)) {
      throw new Error("Invalid email format");
    }

    // For login purpose, check if email exists in database
    if (purpose === 'login') {
      const emailExists = await checkEmailExists(to);
      if (!emailExists) {
        throw new Error("No account found with this email address");
      }

      const isVerified = await checkUserVerified(to);
      if (!isVerified) {
        throw new Error("Please verify your email first before logging in");
      }
    }

    // For signup, check if email already exists
    if (purpose === 'signup') {
      const emailExists = await checkEmailExists(to);
      if (emailExists) {
        throw new Error("An account with this email already exists");
      }
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // You can also use "Outlook", "Yahoo", or custom SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const getSubjectAndMessage = (purpose: string, otp: string) => {
      switch (purpose) {
        case 'login':
          return {
            subject: "Login Verification Code",
            text: `Your login verification code is ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Login Verification</h2>
                <p>Your login verification code is:</p>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="color: #666;">This code will expire in 10 minutes.</p>
                <p style="color: #ff0000; font-size: 12px;">⚠️ Do not share this code with anyone. Our team will never ask for your OTP.</p>
              </div>
            `
          };
        case 'signup':
          return {
            subject: "Welcome! Verify Your Email",
            text: `Welcome! Your email verification code is ${otp}. This code will expire in 10 minutes.`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome! Verify Your Email</h2>
                <p>Thank you for signing up! Your email verification code is:</p>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="color: #666;">This code will expire in 10 minutes.</p>
                <p style="color: #ff0000; font-size: 12px;">⚠️ Do not share this code with anyone.</p>
              </div>
            `
          };
        default:
          return {
            subject: "Your Verification Code",
            text: `Your verification code is ${otp}. This code will expire in 10 minutes.`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Verification Code</h2>
                <p>Your verification code is:</p>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="color: #666;">This code will expire in 10 minutes.</p>
              </div>
            `
          };
      }
    };

    const { subject, text, html } = getSubjectAndMessage(purpose, otp);

    const mailOptions = {
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ ${purpose.toUpperCase()} OTP sent to:`, to);
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    
    // Re-throw the error with original message for specific cases
    if (error instanceof Error) {
      if (error.message.includes("No account found") || 
          error.message.includes("Invalid email format") ||
          error.message.includes("already exists") ||
          error.message.includes("verify your email first")) {
        throw error;
      }
    }
    
    throw new Error("Failed to send OTP. Please try again later.");
  }
};
