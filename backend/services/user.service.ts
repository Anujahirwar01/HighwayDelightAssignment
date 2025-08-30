import nodemailer from "nodemailer";

export const sendOTPEmail = async (to: string, otp: string): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can also use "Outlook", "Yahoo", or custom SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent to:", to);
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};
