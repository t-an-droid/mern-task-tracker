import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    dueDate: {
      type: Date,
      default: null
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high'
      },
      default: 'medium'
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'completed'],
        message: 'Status must be pending or completed'
      },
      default: 'pending'
    },
    category: {
      type: String,
      trim: true,
      default: 'general',
      maxlength: [30, 'Category cannot exceed 30 characters']
    }
  },
  {
    timestamps: true
  }
);

// Add index to speed up filtering and sorting
taskSchema.index({ status: 1, priority: 1, dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
