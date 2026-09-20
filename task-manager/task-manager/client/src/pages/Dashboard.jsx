import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useDarkMode } from '../hooks/useDarkMode';
import { taskAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [isDark, setIsDark] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { showToast } = useToast();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      params.sortBy = sortBy;
      params.order = order;

      const res = await taskAPI.getTasks(params);
      setTasks(res.data.tasks);
      setStats(res.data.stats);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, sortBy, order, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => fetchTasks(), 300); // debounce search
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    try {
      if (editingTask) {
        await taskAPI.updateTask(editingTask._id, form);
        showToast('Task updated successfully', 'success');
      } else {
        await taskAPI.createTask(form);
        showToast('Task created successfully', 'success');
      }
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await taskAPI.deleteTask(deleteTarget._id);
      showToast('Task deleted', 'success');
      setDeleteTarget(null);
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete task', 'error');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      await taskAPI.updateTask(task._id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task', 'error');
    }
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.total, color: 'bg-primary-600' },
    { label: 'Pending', value: stats.pending, color: 'bg-amber-500' },
    { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-500' },
    { label: 'Completed', value: stats.completed, color: 'bg-emerald-500' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar isDark={isDark} setIsDark={setIsDark} open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl leading-none">☰</button>
          <span className="font-bold">TaskFlow</span>
          <div className="w-6" />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage all of your tasks in one place</p>
            </div>
            <button
              onClick={handleCreate}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition shadow-sm"
            >
              + Add New Task
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((s) => (
              <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className={`h-2 w-10 rounded-full ${s.color} mb-3`} />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search tasks by title..."
              className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All statuses</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All priorities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [sb, ord] = e.target.value.split('-');
                setSortBy(sb);
                setOrder(ord);
              }}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="createdAt-desc">Newest first</option>
              <option value="createdAt-asc">Oldest first</option>
              <option value="dueDate-asc">Due date ↑</option>
              <option value="dueDate-desc">Due date ↓</option>
              <option value="title-asc">Title A–Z</option>
            </select>
          </div>

          {/* Task grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-5xl mb-3">🗒️</div>
              <h3 className="font-semibold text-lg mb-1">No tasks found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {search || statusFilter || priorityFilter ? 'Try adjusting your filters.' : 'Create your first task to get started.'}
              </p>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition"
              >
                + Add New Task
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={setDeleteTarget}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
        </main>

        {/* Mobile floating add button */}
        <button
          onClick={handleCreate}
          className="sm:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary-600 text-white text-2xl shadow-lg flex items-center justify-center"
        >
          +
        </button>
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingTask}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete task?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Dashboard;
