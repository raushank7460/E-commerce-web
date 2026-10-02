import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // Sync token state on startup
  useEffect(() => {
    if (user?.token) {
      api.get('/api/auth/me')
        .then((res) => {
          if (res.data?.data) {
            const updated = { ...user, ...res.data.data };
            setUser(updated);
            localStorage.setItem('userInfo', JSON.stringify(updated));
          }
        })
        .catch(() => {
          // If token expired, clear
          logout();
        });
    }
  }, []);

  const login = async (loginIdentifier, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { loginIdentifier, password });
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      return { success: true, data: userData };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', userData);
      const registered = res.data.data;
      setUser(registered);
      localStorage.setItem('userInfo', JSON.stringify(registered));
      return { success: true, data: registered, devOtp: registered.devOtp };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/api/users/profile', profileData);
      const updated = { ...user, ...res.data.data };
      setUser(updated);
      localStorage.setItem('userInfo', JSON.stringify(updated));
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const sendEmailOtp = async (email) => {
    try {
      const res = await api.post('/api/auth/send-email-otp', { email });
      return { success: true, devOtp: res.data.data?.devOtp, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const verifyEmailOtp = async (email, otp) => {
    try {
      const res = await api.post('/api/auth/verify-email-otp', { email, otp });
      if (user) {
        const updated = { ...user, isEmailVerified: true };
        setUser(updated);
        localStorage.setItem('userInfo', JSON.stringify(updated));
      }
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const sendMobileOtp = async (mobileNumber) => {
    try {
      const res = await api.post('/api/auth/send-mobile-otp', { mobileNumber });
      return { success: true, devOtp: res.data.data?.devOtp, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const verifyMobileOtp = async (mobileNumber, otp) => {
    try {
      const res = await api.post('/api/auth/verify-mobile-otp', { mobileNumber, otp });
      if (user) {
        const updated = { ...user, isMobileVerified: true, mobileNumber: mobileNumber || user.mobileNumber };
        setUser(updated);
        localStorage.setItem('userInfo', JSON.stringify(updated));
      }
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        sendEmailOtp,
        verifyEmailOtp,
        sendMobileOtp,
        verifyMobileOtp,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
