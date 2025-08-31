import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: ''
  });
  
  const [showOTPField, setShowOTPField] = useState(false);
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
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

      // Validate form data
      if (!formData.name.trim()) {
        setError('Name is required');
        return;
      }
      
      if (!formData.email.trim()) {
        setError('Email is required');
        return;
      }
      
      if (!formData.dateOfBirth) {
        setError('Date of birth is required');
        return;
      }

      const age = calculateAge(formData.dateOfBirth);
      if (age < 10 || age > 120) {
        setError('Age must be between 10 and 120 years');
        return;
      }

      // Prepare signup data
      const signupData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        age: age
      };

      // Call API to signup
      const response = await authService.signup(signupData);
      
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

      // Call API to verify OTP
      const response = await authService.verifyOTP({
        email: formData.email.trim(),
        otp: otp.trim()
      });

      if (response.success) {
        setSuccessMessage('Email verified successfully! Redirecting to dashboard...');
        // Redirect to dashboard after successful verification
        setTimeout(() => {
          navigate('/');
        }, 2000);
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
      
      const response = await authService.resendOTP({ email: formData.email.trim() });
      
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
    <div className="min-h-screen bg-gray-50  flex flex-col">
      {/* Status Bar */}
      {/* <div className="flex justify-between items-center px-6 py-2 bg-white">
        <span className="text-black font-medium">9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
          <svg className="w-6 h-4 ml-2" viewBox="0 0 24 16" fill="none">
            <rect x="1" y="3" width="22" height="10" rx="2" stroke="black" strokeWidth="1" fill="none"/>
            <rect x="2" y="4" width="18" height="8" rx="1" fill="black"/>
          </svg>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 bg-white px-6 py-4">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7v10c0 5.55 3.84 9 10 9s10-3.45 10-9V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">HD</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h1>
          <p className="text-gray-500 text-sm">Sign up to enjoy the feature of HD</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
              {successMessage}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm text-gray-600 mr-58 font-semibold ">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          {/* Date of Birth Field */}
          <div>
            <label className="block text-sm text-gray-600 mr-55 font-semibold ">Date of Birth</label>
            <div className="relative">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm text-gray-600 mr-67 font-semibold ">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          {/* OTP Field - Only show after Get OTP is clicked */}
          {showOTPField && (
            <div>
              <label className="block text-sm text-gray-600 font-semibold ">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={handleOTPChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                disabled={loading}
              />
              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-blue-500 text-sm hover:underline disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Get OTP / Verify OTP Button */}
        {!showOTPField ? (
          <button
            onClick={handleGetOTP}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium text-lg mt-4 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending OTP...' : 'Get OTP'}
          </button>
        ) : (
          <button
            onClick={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-medium text-lg mt-2 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        )}

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <span className="text-gray-500 text-sm">Already have an account? </span>
          <Link
            to="/signin"
            className="text-blue-500 text-sm font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Bottom Indicator */}
      <div className="flex justify-center pb-4">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default SignUp;