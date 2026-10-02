import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiPieChart,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiArrowLeft,
  FiShield,
  FiLogOut
} from 'react-icons/fi';

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: FiPieChart },
    { label: 'Products', path: '/admin/products', icon: FiBox },
    { label: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
    { label: 'Users', path: '/admin/users', icon: FiUsers }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-wide">ADMIN PORTAL</h2>
              <p className="text-[10px] text-teal-400 font-mono">NexusStore v2.5</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Return to Store</span>
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors w-full"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
