import React, { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Plus, Calendar, Tag, AlertTriangle, Layers } from 'lucide-react';

const TaskForm = () => {
  const { addTask } = useContext(TaskContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Work');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCat, setShowCustomCat] = useState(false);

  // Validation States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be under 100 characters';
    }

    if (description.trim().length > 500) {
      newErrors.description = 'Description must be under 500 characters';
    }

    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(dueDate);
      if (selected < today) {
        newErrors.dueDate = 'Warning: Due date is in the past';
      }
    }

    if (showCustomCat && !customCategory.trim()) {
      newErrors.category = 'Custom category name is required';
    }

    setErrors(newErrors);
    // Block submit only on actual structural errors (title empty/long or missing custom category)
    return !newErrors.title && (!showCustomCat || !newErrors.category);
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    if (val === 'custom') {
      setShowCustomCat(true);
    } else {
      setShowCustomCat(false);
      setErrors((prev) => ({ ...prev, category: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    const finalCategory = showCustomCat ? customCategory.trim() : category;

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      priority,
      category: finalCategory || 'general'
    };

    const result = await addTask(taskData);
    setIsSubmitting(false);

    if (result.success) {
      // Reset form fields
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setCategory('Work');
      setCustomCategory('');
      setShowCustomCat(false);
      setErrors({});
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-deep)' }}>
        <Plus size={20} /> Add New Task
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Task Title */}
        <div className="form-group">
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            className={errors.title ? 'error-border' : ''}
          />
          {errors.title && <span className="validation-error">{errors.title}</span>}
        </div>

        {/* Task Description */}
        <div className="form-group">
          <label htmlFor="task-desc">Description</label>
          <textarea
            id="task-desc"
            placeholder="Add details, instructions or comments"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
            }}
          />
          <span style={{ fontSize: '0.75rem', alignSelf: 'flex-end', color: 'var(--text-muted)' }}>
            {description.length}/500 chars
          </span>
          {errors.description && <span className="validation-error">{errors.description}</span>}
        </div>

        {/* Category Selector */}
        <div className="form-group">
          <label htmlFor="task-cat" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={14} /> Category
          </label>
          <select id="task-cat" value={category} onChange={handleCategoryChange}>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
            <option value="Learning">Learning</option>
            <option value="custom">Other / Custom Category...</option>
          </select>
        </div>

        {/* Custom Category Input if selected Custom */}
        {showCustomCat && (
          <div className="form-group" style={{ marginTop: '-0.5rem' }}>
            <input
              type="text"
              placeholder="Enter category name"
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value);
                if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
              }}
            />
            {errors.category && <span className="validation-error">{errors.category}</span>}
          </div>
        )}

        {/* Due Date & Priority Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Due Date */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="task-due" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} /> Due Date
            </label>
            <input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: null }));
              }}
            />
            {errors.dueDate && (
              <span className="validation-error" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#B8A04D' }}>
                <AlertTriangle size={12} /> {errors.dueDate}
              </span>
            )}
          </div>

          {/* Priority */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="task-priority" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Tag size={14} /> Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
