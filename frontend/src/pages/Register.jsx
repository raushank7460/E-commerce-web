import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OtpModal from '../components/OtpModal';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiArrowRight,
  FiShield
} from 'react-icons/fi';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // OTP Modal after registration
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    const res = await register({
      name: form.name,
      username: form.username,
      email: form.email,
      mobileNumber: form.mobileNumber,
      password: form.password
    });

    setLoading(false);

    if (res.success) {
      setRegisteredEmail(form.email);
      if (res.devOtp?.emailOtp) {
        setDevOtpHint(res.devOtp.emailOtp);
      }
      setOtpModalOpen(true);
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
            <FiShield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create an Account</h2>
          <p className="text-xs text-slate-500">
            Join NexusStore to unlock personalized recommendations & order tracking
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                />
                <FiUser className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                />
                <FiUser className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
              />
              <FiMail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={form.mobileNumber}
                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
              />
              <FiPhone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                />
                <FiLock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                />
                <FiLock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700">
            Sign In
          </Link>
        </div>
      </div>

      {/* Verification OTP Modal triggered right after registration */}
      <OtpModal
        isOpen={otpModalOpen}
        onClose={() => {
          setOtpModalOpen(false);
          navigate('/');
        }}
        type="email"
        identifier={registeredEmail}
        onVerified={() => {
          navigate('/');
        }}
      />
    </div>
  );
};

export default Register;
