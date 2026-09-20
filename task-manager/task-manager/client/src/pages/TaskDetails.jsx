import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useDarkMode } from '../hooks/useDarkMode';
import { taskAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { showToast } = useToast();

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await taskAPI.getTask(id);
      setTask(res.data.task);
    } catch (err) {
      showToast(err.response?.data?.message || 'Task not found', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (form) => {
    try {
      const res = await taskAPI.updateTask(id, form);
      setTask(res.data.task);
      showToast('Task updated successfully', 'success');
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await taskAPI.deleteTask(id);
      showToast('Task deleted', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar isDark={isDark} setIsDark={setIsDark} open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl leading-none">☰</button>
          <span className="font-bold">TaskFlow</span>
          <div className="w-6" />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl w-full mx-auto">
          <Link to="/dashboard" className="text-sm text-primary-600 hover:underline mb-4 inline-block">← Back to Dashboard</Link>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : task ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold">{task.title}</h1>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setConfirmOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Due date</div>
                  <div className="font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Created</div>
                  <div className="font-medium">{new Date(task.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Last updated</div>
                  <div className="font-medium">{new Date(task.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleUpdate} initialData={task} />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete task?"
        message={`Are you sure you want to delete "${task?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default TaskDetails;
