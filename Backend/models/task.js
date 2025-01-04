// Backend/models/task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: 100
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { 
  timestamps: true 
});

// Add indexes for better query performance
taskSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);