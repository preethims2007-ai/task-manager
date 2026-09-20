import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">T</div>
          <span className="font-bold text-xl">TaskFlow</span>
        </div>
        <div className="flex gap-3">
          {user ? (
            <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Log in
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition">
                Sign up free
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto text-center px-6 pt-16 pb-24">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
          Organize your work.<br />
          <span className="text-primary-600">Ship it faster.</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-10">
          TaskFlow is a simple, secure task manager that helps you track priorities,
          deadlines, and progress — all in one clean dashboard.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-600/20">
            Get started — it's free
          </Link>
          <Link to="/login" className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            Log in
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-20 text-left">
          {[
            { icon: '✅', title: 'Stay on top of tasks', desc: 'Create, edit, and track tasks with statuses and priorities.' },
            { icon: '🔍', title: 'Search & filter', desc: 'Find what matters fast with search, filters, and sorting.' },
            { icon: '🔒', title: 'Secure by default', desc: 'JWT authentication and hashed passwords keep your data safe.' },
          ].map((f) => (
            <div key={f.title} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Landing;
