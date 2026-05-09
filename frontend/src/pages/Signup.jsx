import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { FaLeaf, FaSeedling } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from '../utils/toast';
import AuthFormWrapper from './AuthFormWrapper';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { googleOAuthEnabled } from '../App';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [animated, setAnimated] = useState(false);
  const { signup, loading, handleGoogleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setAnimated(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.passwordConfirm) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await signup(formData);
    } catch (error) {
      // Error handled in auth provider
    }
  };

  const handleGoogleSuccess = async (googleData) => {
    try {
      await handleGoogleLogin(googleData);
      navigate('/', { replace: true });
    } catch (error) {
      // toast shown by handleGoogleLogin
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google signup failed:', error);
    toast.error('Google signup failed. Please try again.');
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-white relative overflow-hidden">
      {/* Animated Spider Web Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Web Lines */}
        <div className="absolute inset-0 opacity-10">
          {/* Radial Web Lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <div
              key={angle}
              className="absolute top-1/2 left-1/2 w-0.5 h-96 bg-green-400 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${animated ? 1 : 0})`,
                transformOrigin: 'center',
                transitionDelay: `${angle * 10}ms`
              }}
            />
          ))}
          
          {/* Concentric Circles */}
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute top-1/2 left-1/2 border border-green-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
              style={{
                width: `${ring * 300}px`,
                height: `${ring * 300}px`,
                opacity: 0.2 - (ring * 0.05),
                transform: `translate(-50%, -50%) scale(${animated ? 1 : 0})`,
                transitionDelay: `${ring * 200}ms`
              }}
            />
          ))}
        </div>
        
        {/* Floating Agricultural Elements */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-green-400 to-amber-400 rounded-full animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}

        {/* Corner Web Accents */}
        <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-green-300 opacity-30 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0})` }}></div>
        <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-green-300 opacity-30 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0})`, transitionDelay: '200ms' }}></div>
        <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-green-300 opacity-30 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0})`, transitionDelay: '400ms' }}></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-green-300 opacity-30 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0})`, transitionDelay: '600ms' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Back to site */}
          <div className="mb-4 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-green-700 hover:text-green-900 transition-colors"
            >
              <span>←</span>
              <span>Back to site</span>
            </Link>
          </div>

          {/* Agricultural Branding Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-green-200 mb-4 hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-amber-500 rounded-xl flex items-center justify-center">
                <FaLeaf className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-green-900 text-lg">Nashma Agribusiness</div>
                <div className="text-green-600 text-sm">Join Our Growing Community</div>
              </div>
            </Link>
          </div>

          <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-200 p-8 transition-all duration-1000 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
                <UserPlus className="w-4 h-4" />
                Create Your Account
              </div>
              <h2 className="text-3xl font-bold text-green-900 mb-2">
                Join Our <span className="text-amber-600">Agricultural Network</span>
              </h2>
              <p className="text-green-700">
                Become part of our sustainable farming community
              </p>
            </div>

            {googleOAuthEnabled && (
              <>
                <GoogleLoginButton
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  text="Sign up with Google"
                  loading={loading}
                />
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-green-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-green-600 font-medium">Or continue with email</span>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-green-800 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-all placeholder-green-400"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-green-800 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-all placeholder-green-400"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-green-800 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-all placeholder-green-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-green-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-all placeholder-green-400"
                    placeholder="Create password"
                    minLength="6"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-green-600">
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-green-800 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                  <input
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-all placeholder-green-400"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-amber-600 text-white py-3.5 px-4 rounded-xl hover:from-green-700 hover:to-amber-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 font-semibold"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <FaSeedling className="w-5 h-5" />
                    <span>Grow With Us</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <div className="text-sm text-green-700">
                Already part of our community?{' '}
                <button
                  onClick={handleSwitchToLogin}
                  className="text-amber-600 hover:text-amber-700 font-semibold transition-colors underline"
                >
                  Sign in here
                </button>
              </div>
            </div>
          </div>

          {/* Agricultural Footer */}
          <div className="text-center mt-8">
            <p className="text-green-600 text-sm">
              Join 500+ farmers and agricultural enthusiasts in our sustainable network
            </p>
          </div>
        </div>
      </div>

      {/* Add custom animation for floating particles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(180deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Signup;