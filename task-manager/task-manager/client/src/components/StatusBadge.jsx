import React from 'react';

const statusStyles = {
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || ''}`}>
    {status}
  </span>
);

export default StatusBadge;
