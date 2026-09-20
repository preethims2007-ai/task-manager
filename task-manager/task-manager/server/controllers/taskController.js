const Task = require('../models/Task');

const VALID_STATUS = ['Pending', 'In Progress', 'Completed'];
const VALID_PRIORITY = ['Low', 'Medium', 'High'];

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${VALID_STATUS.join(', ')}` });
    }
    if (priority && !VALID_PRIORITY.includes(priority)) {
      return res.status(400).json({ success: false, message: `Priority must be one of: ${VALID_PRIORITY.join(', ')}` });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      user: req.user._id,
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all tasks for the logged-in user (with search/filter/sort)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy, order } = req.query;

    const query = { user: req.user._id };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (status && VALID_STATUS.includes(status)) {
      query.status = status;
    }
    if (priority && VALID_PRIORITY.includes(priority)) {
      query.priority = priority;
    }

    let sortField = 'createdAt';
    if (sortBy === 'dueDate') sortField = 'dueDate';
    else if (sortBy === 'createdAt') sortField = 'createdAt';
    else if (sortBy === 'title') sortField = 'title';

    const sortOrder = order === 'asc' ? 1 : -1;

    const tasks = await Task.find(query).sort({ [sortField]: sortOrder });

    const stats = {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
    };

    res.status(200).json({ success: true, count: tasks.length, stats, tasks });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single task by id
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this task' });
    }

    res.status(200).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${VALID_STATUS.join(', ')}` });
    }
    if (priority && !VALID_PRIORITY.includes(priority)) {
      return res.status(400).json({ success: false, message: `Priority must be one of: ${VALID_PRIORITY.join(', ')}` });
    }
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title cannot be empty' });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.status(200).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
