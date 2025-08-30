import api from './api';

// Types for API responses
export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  isVerified: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  age: number;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    name: string;
  };
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface LoginData {
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    name: string;
  };
}

export interface VerifyLoginOTPResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ResendOTPData {
  email: string;
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
  }>;
}

// Authentication Service Class
class AuthService {
  // Sign up new user
  async signup(userData: SignupData): Promise<SignupResponse> {
    try {
      const response = await api.post<SignupResponse>('/users/signup', userData);
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Verify OTP
  async verifyOTP(otpData: VerifyOTPData): Promise<VerifyOTPResponse> {
    try {
      const response = await api.post<VerifyOTPResponse>('/users/verify-otp', otpData);
      
      // Store token and user data in localStorage
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Login user (sends OTP)
  async login(loginData: LoginData): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/users/login', loginData);
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Verify Login OTP
  async verifyLoginOTP(otpData: VerifyOTPData): Promise<VerifyLoginOTPResponse> {
    try {
      const response = await api.post<VerifyLoginOTPResponse>('/users/verify-login-otp', otpData);
      
      // Store token and user data in localStorage
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Resend OTP
  async resendOTP(resendData: ResendOTPData): Promise<ResendOTPResponse> {
    try {
      const response = await api.post<ResendOTPResponse>('/users/resend-otp', resendData);
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Handle API errors
  private handleError(error: unknown): Error {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: ErrorResponse } };
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        return new Error(errorData.message || 'An error occurred');
      }
    }
    
    if (error instanceof Error && error.message) {
      return new Error(error.message);
    }
    
    return new Error('Network error. Please check your connection.');
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
