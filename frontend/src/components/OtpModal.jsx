import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiX, FiCheckCircle, FiShield, FiSend, FiAlertCircle } from 'react-icons/fi';

const OtpModal = ({ isOpen, onClose, type = 'email', identifier, onVerified }) => {
  const { verifyEmailOtp, verifyMobileOtp, sendEmailOtp, sendMobileOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval = null;
    if (isOpen && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      if (type === 'email') {
        result = await verifyEmailOtp(identifier, otp);
      } else {
        result = await verifyMobileOtp(identifier, otp);
      }

      if (result.success) {
        setSuccess('Verified successfully!');
        setTimeout(() => {
          if (onVerified) onVerified();
          onClose();
        }, 1200);
      } else {
        setError(result.message || 'Verification failed');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError('');
    setSuccess('');
    try {
      let res;
      if (type === 'email') {
        res = await sendEmailOtp(identifier);
      } else {
        res = await sendMobileOtp(identifier);
      }
      if (res.success) {
        setTimer(60);
        if (res.devOtp) {
          setDevOtpHint(res.devOtp);
        }
        setSuccess(`A new OTP has been dispatched.`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <FiShield className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 capitalize">
            Verify {type}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Please enter the 6-digit verification code sent to{' '}
            <span className="font-bold text-slate-800">{identifier}</span>
          </p>

          {devOtpHint && (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-mono">
              🔑 Demo Simulation Code: <strong>{devOtpHint}</strong>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit OTP"
              className="w-full text-center text-2xl tracking-[0.5em] font-mono font-bold py-3 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : 'Confirm Verification'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            {timer > 0 ? `Resend Code in ${timer}s` : 'Resend Code Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
