import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiShield, FiUser } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(identifier, password);
    setLoading(false);

    if (res.success) {
      navigate(redirect);
    } else {
      setError(res.message || 'Login failed');
    }
  };

  const handleQuickDemo = (demoEmail, demoPw) => {
    setIdentifier(demoEmail);
    setPassword(demoPw);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
            <FiUser className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to your NexusStore customer or admin account</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Email, Username or Phone
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com or +91..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
              />
              <FiMail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
              />
              <FiLock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Instant Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@store.com', 'Admin@123')}
              className="p-2 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-teal-800 text-[11px] font-bold transition-colors text-center"
            >
              👑 Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('user@store.com', 'User@123')}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition-colors text-center"
            >
              🛍️ Demo Customer
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
