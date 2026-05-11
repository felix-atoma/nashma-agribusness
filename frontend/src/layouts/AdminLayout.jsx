import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiPackage, FiPlusCircle, FiShoppingBag, FiLogOut, FiExternalLink } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const navItems = [
  { to: '/admin',                  label: 'Dashboard',     icon: FiGrid,        end: true },
  { to: '/admin/products',         label: 'Products',      icon: FiPackage },
  { to: '/admin/products/create',  label: 'Add Product',   icon: FiPlusCircle },
  { to: '/admin/orders',           label: 'Orders',        icon: FiShoppingBag },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const initial = (user?.firstName || user?.name || 'A').charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-60 bg-green-900 text-white flex flex-col flex-shrink-0 shadow-xl">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-green-700/60">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FaLeaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-none">Nashma</p>
            <p className="text-green-400 text-[11px] mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-white shadow'
                    : 'text-green-200 hover:bg-green-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="px-3 py-4 border-t border-green-700/60 space-y-0.5">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-green-300 hover:bg-green-800 hover:text-white transition-all"
          >
            <FiExternalLink className="w-4 h-4 flex-shrink-0" />
            View Website
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-green-300 hover:bg-red-900/50 hover:text-red-300 transition-all"
          >
            <FiLogOut className="w-4 h-4 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Welcome back, {user?.firstName || user?.name || 'Admin'}
            </p>
            <p className="text-xs text-gray-400">Nashma Agribusiness Control Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-gray-700">{user?.email}</p>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Administrator</p>
            </div>
            <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initial}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
