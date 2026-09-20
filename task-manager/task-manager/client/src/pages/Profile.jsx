import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';

const Profile = () => {
  const [isDark, setIsDark] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    taskAPI.getTasks({}).then((res) => setStats(res.data.stats)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar isDark={isDark} setIsDark={setIsDark} open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl leading-none">☰</button>
          <span className="font-bold">TaskFlow</span>
          <div className="w-6" />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-2xl w-full mx-auto">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-lg">{user?.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4">Your task activity</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-500">{stats.pending}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-500">{stats.completed}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
