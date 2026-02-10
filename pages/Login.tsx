
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Phone, ArrowRight, Loader2, Github, Facebook, User, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { login, loginWithOtp, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      if (view === 'login') {
        success = await login(email, password);
      } else if (view === 'signup') {
        success = await register(name, email, password);
      } else if (view === 'otp') {
        success = await loginWithOtp(phone, otp);
      } else if (view === 'forgot') {
        // Simulate password reset
        await new Promise(r => setTimeout(r, 1000));
        setResetSent(true);
        setLoading(false);
        return;
      }

      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      if (view !== 'forgot') setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            P
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Account'}
            {view === 'forgot' && 'Reset Password'}
            {view === 'otp' && 'Verify Phone'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {view === 'login' && 'Sign in to access your projects and dashboard'}
            {view === 'signup' && 'Join thousands of engineering students'}
            {view === 'forgot' && 'Enter your email to receive recovery instructions'}
            {view === 'otp' && 'We sent a 6-digit code to your number'}
          </p>
        </div>

        {/* Success Message for Reset */}
        {view === 'forgot' && resetSent ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 p-4 rounded-lg text-green-700 text-sm">
              Check your email for the reset link!
            </div>
            <button onClick={() => { setView('login'); setResetSent(false); }} className="text-orange-600 font-medium hover:underline">
              Back to Login
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {view === 'signup' && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              {(view === 'login' || view === 'signup' || view === 'forgot') && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              {(view === 'login' || view === 'signup') && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              {view === 'otp' && (
                <>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                      placeholder="Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShieldCheck className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      name="otp"
                      type="text"
                      maxLength={6}
                      required
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm tracking-widest font-mono"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {view === 'login' && (
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button type="button" onClick={() => setView('otp')} className="font-medium text-slate-600 hover:text-slate-500">
                    Use Phone / OTP
                  </button>
                </div>
                <div className="text-sm">
                  <button type="button" onClick={() => setView('forgot')} className="font-medium text-orange-600 hover:text-orange-500">
                    Forgot password?
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {view === 'login' && 'Sign In'}
                  {view === 'signup' && 'Create Account'}
                  {view === 'forgot' && 'Send Reset Link'}
                  {view === 'otp' && 'Verify & Login'}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Switch Views */}
            <div className="text-center text-sm">
              {view === 'login' || view === 'otp' ? (
                <p className="text-slate-500">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setView('signup')} className="font-medium text-orange-600 hover:text-orange-500">
                    Sign up now
                  </button>
                </p>
              ) : (
                <p className="text-slate-500">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setView('login')} className="font-medium text-orange-600 hover:text-orange-500">
                    Sign in
                  </button>
                </p>
              )}
            </div>

            {/* Social Login Visuals */}
            {(view === 'login' || view === 'signup') && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                    <span className="sr-only">Sign in with Google</span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-.61-.06-1.1-.15-1.81z"
                      />
                    </svg>
                  </button>
                  <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                    <span className="sr-only">Sign in with Facebook</span>
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
