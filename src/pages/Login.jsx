import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, ShieldCheck, UserPlus, LogIn } from 'lucide-react';

// ─── Change this secret invite code to whatever you want ─────────────────────
const INVITE_CODE = 'ELITE2024';
// ─────────────────────────────────────────────────────────────────────────────

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Welcome back!');
        navigate('/admin');
      } else {
        // Validate invite code first
        if (inviteCode.trim().toUpperCase() !== INVITE_CODE) {
          toast.error('Invalid invite code. Contact the site owner.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          toast.error("Passwords don't match.");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        const { error } = await signUp(email, password);
        if (error) throw error;

        toast.success(
          'Account created! Check your email to verify, then sign in.',
          { duration: 6000 }
        );
        // Switch back to login
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        setInviteCode('');
      }
    } catch (error) {
      toast.error(error.message || (mode === 'login' ? 'Failed to sign in.' : 'Failed to create account.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <div className="text-3xl font-black tracking-tight text-gray-900">ELITE</div>
          <div className="text-xs tracking-[0.2em] text-gray-500 uppercase font-medium mt-1">Furniture</div>
        </Link>

        <div className="mt-8 flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#C8A570]" />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {mode === 'login' ? 'Admin Sign In' : 'Create Admin Account'}
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {mode === 'login' ? 'Access the Elite Furniture dashboard' : 'Only authorised personnel can create accounts'}
        </p>
      </div>

      {/* Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl border border-gray-200">

          {/* Mode Toggle Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-7">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                mode === 'login'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                mode === 'register'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              New Account
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-800">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8A570] focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-800">
                  Password
                </label>
                {mode === 'login' && (
                  <Link to="/forgot-password" className="text-xs font-medium text-[#C8A570] hover:text-[#B5925F] transition-colors">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8A570] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Register-only fields */}
            {mode === 'register' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-800">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8A570] focus:border-transparent transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inviteCode" className="text-sm font-medium text-gray-800">
                    Invite Code <span className="text-gray-400 font-normal">(required)</span>
                  </label>
                  <input
                    id="inviteCode"
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter invite code"
                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8A570] focus:border-transparent transition"
                  />
                  <p className="text-xs text-gray-400">Contact the site owner to get your invite code.</p>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-black text-white h-11 text-sm font-bold tracking-wide hover:bg-[#C8A570] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <>
                  {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {mode === 'login' ? 'Sign In to Dashboard' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center flex flex-col gap-3">
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-sm font-medium text-[#C8A570] hover:text-[#B5925F] transition-colors"
              >
                Need an admin account? Sign up with an invite code
              </button>
            )}
            {mode === 'register' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm font-medium text-[#C8A570] hover:text-[#B5925F] transition-colors"
              >
                Already have an account? Sign in here
              </button>
            )}
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors mt-2">
              ← Back to Elite Furniture website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
