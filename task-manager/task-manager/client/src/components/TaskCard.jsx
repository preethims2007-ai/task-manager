import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/tasks/${task._id}`}
          className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2"
        >
          {task.title}
        </Link>
        <input
          type="checkbox"
          checked={task.status === 'Completed'}
          onChange={() => onToggleComplete(task)}
          title="Mark as completed"
          className="mt-1 h-5 w-5 accent-primary-600 cursor-pointer shrink-0"
        />
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      {task.dueDate && (
        <p className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
          {isOverdue ? '⚠ Overdue: ' : 'Due: '}
          {new Date(task.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
      )}

      <div className="flex gap-2 mt-1 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 text-xs font-medium py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="flex-1 text-xs font-medium py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
