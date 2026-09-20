import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const linkBase =
  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors';
const linkActive = 'bg-primary-600 text-white';
const linkInactive =
  'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';

const Sidebar = ({ isDark, setIsDark, open, setOpen }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="px-6 py-5 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">T</div>
          <span className="font-bold text-lg">TaskFlow</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
            onClick={() => setOpen(false)}
          >
            📋 Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
            onClick={() => setOpen(false)}
          >
            👤 Profile
          </NavLink>
        </nav>

        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`${linkBase} ${linkInactive} w-full`}
          >
            {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
          </button>
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 truncate">
            Signed in as <span className="font-medium">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
