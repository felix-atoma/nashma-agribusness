import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiPackage, FiPlusCircle, FiShoppingBag,
  FiLogOut, FiExternalLink, FiMenu, FiX,
} from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const navItems = [
  { to: '/admin',                 label: 'Dashboard',  icon: FiGrid,        end: true },
  { to: '/admin/products',        label: 'Products',   icon: FiPackage },
  { to: '/admin/products/create', label: 'Add Product',icon: FiPlusCircle },
  { to: '/admin/orders',          label: 'Orders',     icon: FiShoppingBag },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  const initial = (user?.firstName || user?.name || 'A').charAt(0).toUpperCase();
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || 'Admin';

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    if (!sidebarOpen) return;
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sidebarOpen]);

  // Lock scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-green-700/60 flex-shrink-0">
        <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
          <FaLeaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-base leading-none tracking-wide">Nashma</p>
          <p className="text-green-400 text-[11px] mt-1 tracking-wider uppercase">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-green-500 uppercase tracking-widest mb-3">Navigation</p>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-900/30'
                  : 'text-green-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-green-700/60 space-y-0.5 flex-shrink-0">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-green-300 hover:bg-white/10 hover:text-white transition-all"
        >
          <FiExternalLink className="w-4 h-4 flex-shrink-0" />
          View Website
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-green-300 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <FiLogOut className="w-4 h-4 flex-shrink-0" />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Desktop sidebar (always visible ≥ lg) ── */}
      <aside className="hidden lg:flex w-64 bg-green-900 text-white flex-col flex-shrink-0 shadow-xl">
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* ── Mobile sidebar drawer ── */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 max-w-[85vw] bg-green-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-green-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <FiX className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 flex-shrink-0 shadow-sm">
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          {/* Brand on mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaLeaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-green-900 text-sm">Nashma Admin</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-gray-800 leading-none">{fullName}</p>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-0.5">Administrator</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm ring-2 ring-green-100">
              {initial}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
