import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  FiUsers,
  FiSearch,
  FiShield,
  FiTrash2,
  FiCheckCircle,
  FiAlertTriangle,
  FiUser
} from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = roleFilter ? `/api/users?role=${roleFilter}` : '/api/users';
      const res = await api.get(url);
      if (res.data?.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Are you sure you want to promote/demote this user to ${newRole}?`)) return;

    try {
      await api.put(`/api/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;
    try {
      await api.delete(`/api/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.mobileNumber && u.mobileNumber.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Customer & User Accounts</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage roles, view verification status, and audit user permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or mobile..."
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <FiSearch className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email Verification</th>
                <th className="py-3.5 px-4">Mobile Verification</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover bg-slate-800 flex-shrink-0"
                    />
                    <div>
                      <p className="font-extrabold text-white">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {u.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <FiCheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <FiAlertTriangle className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {u.isMobileVerified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <FiCheckCircle className="w-3 h-3" /> {u.mobileNumber || 'Verified'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        {u.mobileNumber ? 'Unverified' : 'Not added'}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleRoleToggle(u._id, u.role)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-400 text-[11px] font-bold rounded-lg transition-colors"
                      title="Toggle Customer / Admin Role"
                    >
                      {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-rose-400 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
