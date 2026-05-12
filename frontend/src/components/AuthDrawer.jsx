import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { FaLeaf } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import Offcanvas from './Offcanvas';
import { toast } from 'react-toastify';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleEnabled = !!GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.startsWith('your_');

const inputCls =
  'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all placeholder-gray-400';

export default function AuthDrawer() {
  const { authOpen, authMode, openAuth, closeAuth, login, signup, handleGoogleLogin, loading } = useAuth();

  const [loginData,  setLoginData]  = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ firstName: '', lastName: '', email: '', password: '', passwordConfirm: '' });
  const [showPwd,    setShowPwd]    = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginData);
      closeAuth();
    } catch {}
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.passwordConfirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (signupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await signup(signupData);
      closeAuth();
    } catch {}
  };

  const handleGoogle = async (googleData) => {
    try {
      await handleGoogleLogin(googleData);
      closeAuth();
    } catch {}
  };

  return (
    <Offcanvas
      isOpen={authOpen}
      onClose={closeAuth}
      title={authMode === 'login' ? 'Sign In' : 'Create Account'}
      width="w-full sm:max-w-[440px]"
    >
      <div className="p-6">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
            <FaLeaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-green-900 text-sm leading-none">Nashma Agribusiness</p>
            <p className="text-green-500 text-xs mt-0.5">Growing Sustainable Futures</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {['login', 'signup'].map(mode => (
            <button
              key={mode}
              onClick={() => openAuth(mode)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                authMode === mode
                  ? 'bg-white text-green-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* ── LOGIN FORM ── */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))}
                  placeholder="you@example.com"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={loginData.password}
                  onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))}
                  placeholder="••••••••"
                  className={`${inputCls} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button type="button" className="text-xs text-green-600 hover:text-green-800 font-semibold">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            {googleEnabled && (
              <>
                <div className="relative flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">OR</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <GoogleLoginButton
                  onSuccess={handleGoogle}
                  onFailure={() => toast.error('Google login failed')}
                  text="signin_with"
                />
              </>
            )}

            <p className="text-center text-sm text-gray-500 pt-2">
              Don't have an account?{' '}
              <button type="button" onClick={() => openAuth('signup')} className="text-green-700 font-bold hover:underline">
                Sign up
              </button>
            </p>
          </form>
        )}

        {/* ── SIGNUP FORM ── */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">First name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={signupData.firstName}
                    onChange={e => setSignupData(d => ({ ...d, firstName: e.target.value }))}
                    placeholder="John"
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Last name</label>
                <input
                  type="text"
                  required
                  value={signupData.lastName}
                  onChange={e => setSignupData(d => ({ ...d, lastName: e.target.value }))}
                  placeholder="Doe"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={signupData.email}
                  onChange={e => setSignupData(d => ({ ...d, email: e.target.value }))}
                  placeholder="you@example.com"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={signupData.password}
                  onChange={e => setSignupData(d => ({ ...d, password: e.target.value }))}
                  placeholder="Min. 6 characters"
                  className={`${inputCls} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={signupData.passwordConfirm}
                  onChange={e => setSignupData(d => ({ ...d, passwordConfirm: e.target.value }))}
                  placeholder="••••••••"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            {googleEnabled && (
              <>
                <div className="relative flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">OR</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <GoogleLoginButton
                  onSuccess={handleGoogle}
                  onFailure={() => toast.error('Google signup failed')}
                  text="signup_with"
                />
              </>
            )}

            <p className="text-center text-sm text-gray-500 pt-2">
              Already have an account?{' '}
              <button type="button" onClick={() => openAuth('login')} className="text-green-700 font-bold hover:underline">
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </Offcanvas>
  );
}
