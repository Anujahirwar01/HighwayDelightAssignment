import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [showOTPField, setShowOTPField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOTP(e.target.value);
    if (error) setError('');
  };

  const handleGetOTP = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      // Validate email
      if (!email.trim()) {
        setError('Email is required');
        return;
      }

      // Call API to login (sends OTP)
      const response = await authService.login({ email: email.trim() });
      
      if (response.success) {
        setSuccessMessage('OTP sent to your email successfully!');
        setShowOTPField(true);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');

      if (!otp.trim() || otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }

      // Call API to verify login OTP
      const response = await authService.verifyLoginOTP({
        email: email.trim(),
        otp: otp.trim()
      });

      if (response.success) {
        setSuccessMessage('Login successful! Redirecting to dashboard...');
        // Redirect to dashboard after successful login
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authService.resendOTP({ email: email.trim() });
      
      if (response.success) {
        setSuccessMessage('OTP resent successfully!');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 bg-white px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7v10c0 5.55 3.84 9 10 9s10-3.45 10-9V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">HD</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-500 text-sm">
            {showOTPField ? 'Enter the OTP sent to your email' : 'Welcome back! Please sign in to your account'}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
              {successMessage}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm text-gray-600 font-semibold mr-68">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              placeholder="Enter your email"
              disabled={loading || showOTPField}
            />
          </div>

          {/* OTP Input Field - Show only after email is verified */}
          {showOTPField && (
            <div>
              <label className="block text-sm text-gray-600 font-semibold ">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={handleOTPChange}
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 text-center text-lg tracking-widest"
                placeholder="000000"
                disabled={loading}
              />
            </div>
          )}

          {/* Action Button */}
          {!showOTPField ? (
            <button
              onClick={handleGetOTP}
              disabled={loading || !email.trim()}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium text-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Sending OTP...' : 'Get OTP'}
            </button>
          ) : (
            <div className="space-y-3 mt-6">
              <button
                onClick={handleVerifyOTP}
                disabled={loading || !otp.trim() || otp.length !== 6}
                className="w-full bg-green-500 text-white py-2 rounded-lg font-medium text-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              
              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="w-full bg-gray-500 text-white py-2 rounded-lg font-medium text-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>
          )}

          {/* Create Account Link */}
          <div className="text-center mt-6">
            <span className="text-gray-500 text-sm">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-blue-500 text-sm font-medium hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Indicator */}
      <div className="flex justify-center pb-4">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default SignIn;