import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  User, Lock, Bell, Shield, LogOut, ChevronRight,
  Eye, EyeOff, CheckCircle, Trash2, Mail, Phone
} from 'lucide-react';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Data', icon: Shield },
];

export default function Settings() {
  const { user, logout, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');

  // Password state
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);

  // Notification prefs state (UI only)
  const [notifs, setNotifs] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: false,
    sms: false,
  });

  const safeUser = user || {};
  const displayName = safeUser.name || `${safeUser.firstName || ''} ${safeUser.lastName || ''}`.trim() || 'User';

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPw !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPw.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setPwLoading(true);
      await updatePassword({ currentPassword: passwords.current, newPassword: passwords.newPw });
      toast.success('Password updated successfully');
      setPasswords({ current: '', newPw: '', confirm: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const PasswordInput = ({ field, label, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={showPw[field] ? 'text' : 'password'}
          value={passwords[field]}
          onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          required
        />
        <button
          type="button"
          onClick={() => setShowPw({ ...showPw, [field]: !showPw[field] })}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account preferences and security</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* User summary */}
              <div className="p-5 border-b border-gray-100 bg-green-50">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mb-3">
                  <User className="w-6 h-6 text-green-700" />
                </div>
                <p className="font-semibold text-green-900 text-sm truncate">{displayName}</p>
                <p className="text-green-600 text-xs truncate">{safeUser.email}</p>
              </div>

              <nav className="p-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === id
                        ? 'bg-green-100 text-green-800'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">

            {/* ── Account Tab ── */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-5">Account Information</h2>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-green-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Full Name</p>
                        <p className="font-semibold text-gray-900 truncate">{displayName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-green-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email Address</p>
                        <p className="font-semibold text-gray-900 truncate">{safeUser.email || '—'}</p>
                      </div>
                    </div>

                    {(safeUser.phone || safeUser.mobileNumber) && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-green-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Phone</p>
                          <p className="font-semibold text-gray-900">{safeUser.phone || safeUser.mobileNumber}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Account Role</p>
                        <p className="font-semibold text-gray-900 capitalize">{safeUser.role || 'Customer'}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="mt-5 flex items-center justify-between w-full px-4 py-3 border-2 border-green-200 hover:border-green-400 text-green-700 rounded-xl transition-colors font-medium text-sm"
                  >
                    Edit Profile Information
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h2>
                  <div className="space-y-2">
                    {[
                      { to: '/orders', label: 'View My Orders' },
                      { to: '/products', label: 'Browse Products' },
                      { to: '/contact', label: 'Contact Support' },
                    ].map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-green-50 text-green-700 font-medium text-sm transition-colors"
                      >
                        {link.label}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Security Tab ── */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Change Password</h2>
                  <p className="text-sm text-gray-500 mb-6">Use a strong password with at least 6 characters.</p>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <PasswordInput field="current" label="Current Password" placeholder="Enter current password" />
                    <PasswordInput field="newPw" label="New Password" placeholder="Enter new password" />
                    <PasswordInput field="confirm" label="Confirm New Password" placeholder="Confirm new password" />

                    <button
                      type="submit"
                      disabled={pwLoading}
                      className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pwLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Tips</h2>
                  <ul className="space-y-3">
                    {[
                      'Use a unique password not used on other sites',
                      'Include numbers, symbols and mixed-case letters',
                      'Never share your password with anyone',
                      'Sign out from shared or public devices',
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <LogOut className="w-5 h-5" /> Sign Out
                  </h2>
                  <p className="text-sm text-red-600 mb-4">Sign out of your account on this device.</p>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Sign Out Now
                  </button>
                </div>
              </div>
            )}

            {/* ── Notifications Tab ── */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Notification Preferences</h2>
                <p className="text-sm text-gray-500 mb-6">Choose what updates you'd like to receive.</p>

                <div className="space-y-4">
                  {[
                    { key: 'orderUpdates', label: 'Order Updates', desc: 'Confirmations, status changes and delivery notifications' },
                    { key: 'promotions', label: 'Promotions & Offers', desc: 'Special deals and seasonal discounts from Nashma' },
                    { key: 'newsletter', label: 'Newsletter', desc: 'Monthly updates on Nashma products and agribusiness news' },
                    { key: 'sms', label: 'SMS Alerts', desc: 'Text messages for order confirmations (Ghana number required)' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-green-200 transition-colors">
                      <div className="flex-1 mr-4">
                        <p className="font-medium text-gray-900 text-sm">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifs({ ...notifs, [key]: !notifs[key] })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                          notifs[key] ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            notifs[key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => toast.success('Notification preferences saved')}
                  className="mt-6 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {/* ── Privacy Tab ── */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Data & Privacy</h2>
                  <div className="space-y-4 text-sm text-gray-600">
                    <p>Nashma Agribusiness collects only the information needed to process your orders and improve your experience. We do not sell your data to third parties.</p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="font-semibold text-green-800 mb-2">What we store:</p>
                      <ul className="space-y-1 text-green-700">
                        {['Your name and contact details', 'Order history and delivery addresses', 'Account login credentials (encrypted)', 'Communication preferences'].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h2>
                  <p className="text-sm text-gray-500 mb-4">For data requests, account issues or privacy concerns, contact us directly.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="mailto:nashmafarms@gmail.com"
                      className="inline-flex items-center justify-center gap-2 border-2 border-green-300 text-green-700 hover:bg-green-50 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      nashmafarms@gmail.com
                    </a>
                    <a
                      href="tel:+233545086577"
                      className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                    >
                      +233 54 508 6577
                    </a>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" /> Delete Account
                  </h2>
                  <p className="text-sm text-red-600 mb-4">
                    To permanently delete your account and all associated data, please contact us at{' '}
                    <a href="mailto:nashmafarms@gmail.com" className="underline font-medium">nashmafarms@gmail.com</a>. We will process your request within 7 business days.
                  </p>
                  <a
                    href="mailto:nashmafarms@gmail.com?subject=Account Deletion Request"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Request Account Deletion
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
