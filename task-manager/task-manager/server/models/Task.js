const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    description: { type: String, trim: true, default: '', maxlength: 2000 },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: { type: Date, default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true } // createdAt, updatedAt
);

TaskSchema.index({ user: 1, status: 1 });
TaskSchema.index({ user: 1, priority: 1 });
TaskSchema.index({ user: 1, title: 'text' });

module.exports = mongoose.model('Task', TaskSchema);
