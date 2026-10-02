import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import OtpModal from '../components/OtpModal';
import api from '../services/api';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiCheck
} from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile, sendEmailOtp, sendMobileOtp } = useAuth();

  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'security' | 'addresses'

  // Profile fields state
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [updating, setUpdating] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' });

  // OTP Modal state
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpType, setOtpType] = useState('email'); // 'email' | 'mobile'
  const [otpIdentifier, setOtpIdentifier] = useState('');

  // Address form
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [newAddr, setNewAddr] = useState({
    name: user?.name || '',
    phone: user?.mobileNumber || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setProfileMsg({ text: '', type: '' });

    const res = await updateProfile({ name, username, mobileNumber, avatar });
    setUpdating(false);

    if (res.success) {
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
    } else {
      setProfileMsg({ text: res.message || 'Failed to update profile', type: 'error' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwMsg({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    try {
      const res = await api.put('/api/users/change-password', {
        currentPassword,
        newPassword
      });
      setPwMsg({ text: res.data?.message || 'Password changed successfully', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwMsg({ text: err.message || 'Failed to update password', type: 'error' });
    }
  };

  const handleOpenEmailVerify = async () => {
    setOtpType('email');
    setOtpIdentifier(user.email);
    await sendEmailOtp(user.email);
    setOtpModalOpen(true);
  };

  const handleOpenMobileVerify = async () => {
    if (!user.mobileNumber) {
      setProfileMsg({ text: 'Please add and save a mobile number first', type: 'error' });
      return;
    }
    setOtpType('mobile');
    setOtpIdentifier(user.mobileNumber);
    await sendMobileOtp(user.mobileNumber);
    setOtpModalOpen(true);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/users/addresses', newAddr);
      if (res.data?.data) {
        setAddresses(res.data.data);
        setNewAddr({ ...newAddr, street: '', city: '', postalCode: '' });
      }
    } catch (err) {
      alert(err.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (addrId) => {
    try {
      const res = await api.delete(`/api/users/addresses/${addrId}`);
      if (res.data?.data) {
        setAddresses(res.data.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete address');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account & Security</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your personal credentials, verification, and delivery addresses</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        {[
          { key: 'details', label: 'Personal Information' },
          { key: 'security', label: 'Security & Password' },
          { key: 'addresses', label: 'Delivery Addresses' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-teal-600 text-teal-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Profile Details & Verifications */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Verification Status Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                Identity Verification
              </h3>

              {/* Email Verification */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FiMail className="w-3.5 h-3.5 text-teal-600" /> Email Status
                  </span>
                  {user?.isEmailVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      <FiCheckCircle className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                      <FiAlertTriangle className="w-3 h-3 text-amber-600" /> Unverified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                {!user?.isEmailVerified && (
                  <button
                    onClick={handleOpenEmailVerify}
                    className="w-full mt-2 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Verify via OTP
                  </button>
                )}
              </div>

              {/* Mobile Verification */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FiPhone className="w-3.5 h-3.5 text-teal-600" /> Mobile Status
                  </span>
                  {user?.isMobileVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      <FiCheckCircle className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                      <FiAlertTriangle className="w-3 h-3 text-amber-600" /> Unverified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {user?.mobileNumber || 'No phone number linked'}
                </p>
                {!user?.isMobileVerified && (
                  <button
                    onClick={handleOpenMobileVerify}
                    className="w-full mt-2 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Verify via SMS OTP
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
              Edit Profile Details
            </h3>

            {profileMsg.text && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={mobileNumber}
                  placeholder="+91 9876543210"
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  {updating ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: Security & Password */}
      {activeTab === 'security' && (
        <div className="max-w-xl bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Change Account Password
          </h3>

          {pwMsg.text && (
            <div
              className={`p-3 rounded-xl text-xs ${
                pwMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {pwMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">New Password (Min. 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between shadow-xs space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{addr.name}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">📞 {addr.phone}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Address Form */}
          <div className="max-w-xl bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
              Add New Address
            </h3>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Recipient Name"
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
                <input
                  type="text"
                  required
                  placeholder="Street / House Number"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="col-span-1 sm:col-span-2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
                <input
                  type="text"
                  required
                  placeholder="Postal Code"
                  value={newAddr.postalCode}
                  onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 text-white rounded-xl font-bold shadow-sm"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      <OtpModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        type={otpType}
        identifier={otpIdentifier}
        onVerified={() => {
          setProfileMsg({
            text: `${otpType === 'email' ? 'Email' : 'Mobile number'} verified successfully!`,
            type: 'success'
          });
        }}
      />
    </div>
  );
};

export default Profile;
