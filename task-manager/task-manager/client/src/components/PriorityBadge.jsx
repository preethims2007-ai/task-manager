import React from 'react';

const priorityStyles = {
  Low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  Medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const dotStyles = {
  Low: 'bg-gray-400',
  Medium: 'bg-orange-500',
  High: 'bg-red-500',
};

const PriorityBadge = ({ priority }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyles[priority] || ''}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[priority]}`} />
    {priority}
  </span>
);

export default PriorityBadge;
