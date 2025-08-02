import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Utensils } from "lucide-react";
import { apiService } from '../services/api';

interface LoginPageProps {
  onLogin: () => void;
  onRoleSelect: (role: "admin" | "vendor") => void;
  onForgotPassword: () => void;
  onOTPRequired: (email: string) => void;
  onForgotPassword: () => void;
}


export default function LoginPage({
  onLogin,
  onRoleSelect,
  onForgotPassword,
  onOTPRequired,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.login({ email, password });
      
      if (response.success) {
        if (response.data && response.data.token) {
        // Store token
        localStorage.setItem('auth_token', response.data.token);
        
        // Set user role
        const userRole = response.data.user?.role?.toLowerCase() || 'vendor';
        if (userRole === 'admin' || userRole === 'vendor') {
          onRoleSelect(userRole as 'admin' | 'vendor');
        } else {
          onRoleSelect('vendor'); // Default fallback
        }
        
        onLogin();
        } else {
          // If login successful but no token, might need OTP verification
          if (response.message && response.message.toLowerCase().includes('otp')) {
            onOTPRequired(email);
          } else {
            setError('Login successful but no authentication token received');
          }
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error: any) {
      // Check if OTP verification is required
      if (error.message?.toLowerCase().includes('otp') || 
          error.message?.toLowerCase().includes('verification') ||
          error.message?.toLowerCase().includes('verify')) {
        onOTPRequired(email);
      } else {
        setError(error.message || 'An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Food Image and Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <img src="\public\image\logo\logo_main_bg.png" alt="logo"></img>
          </div>

          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-4">
              Your
              <br />
              <span className="text-red-400">Kitchen</span>
              <br />
              Your Food....
            </h1>
            <p className="text-xl text-gray-200">
              Manage your restaurant business with our comprehensive food
              management system
            </p>
          </div>
        </div>
      </div>

      {/* Right side (login form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Utensils className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-800">eFood</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
            <p className="text-sm text-gray-500">
              Enter your email and password to login
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Email@address.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="8+ characters required"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Forgot password link */}
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember Me</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
