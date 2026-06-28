import React, { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Edit2, Trash2, CheckCircle, Circle, Save, X, Calendar, AlertTriangle } from 'lucide-react';

const TaskCard = ({ task }) => {
  const { editTask, toggleTaskStatus, deleteTask } = useContext(TaskContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [editPriority, setEditPriority] = useState(task.priority);
  const [validationError, setValidationError] = useState('');

  // Determine if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || task.status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleUpdate = async () => {
    if (!editTitle.trim()) {
      setValidationError('Title cannot be empty');
      return;
    }

    const updatedData = {
      title: editTitle.trim(),
      description: editDescription.trim(),
      category: editCategory.trim(),
      dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
      priority: editPriority,
    };

    const res = await editTask(task._id, updatedData);
    if (res.success) {
      setIsEditing(false);
      setValidationError('');
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditCategory(task.category);
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setEditPriority(task.priority);
    setValidationError('');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
        <div className="edit-form-card">
          <h3 style={{ fontSize: '1rem', color: 'var(--brand-deep)' }}>Edit Task Details</h3>
          
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={editTitle}
              placeholder="Task Title"
              onChange={(e) => setEditTitle(e.target.value)}
            />
            {validationError && <span className="validation-error">{validationError}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <textarea
              value={editDescription}
              placeholder="Task Description"
              onChange={(e) => setEditDescription(e.target.value)}
              style={{ minHeight: '60px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.7rem' }}>Category</label>
              <input
                type="text"
                value={editCategory}
                placeholder="Category"
                onChange={(e) => setEditCategory(e.target.value)}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.7rem' }}>Priority</label>
              <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.7rem' }}>Due Date</label>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary btn-icon" onClick={handleCancel} title="Cancel">
              <X size={16} />
            </button>
            <button className="btn btn-primary btn-icon" onClick={handleUpdate} title="Save changes">
              <Save size={16} style={{ color: '#FFFFFF' }} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{
        borderLeft: `4px solid ${
          task.status === 'completed'
            ? 'var(--status-completed-border)'
            : task.priority === 'high'
            ? 'var(--priority-high-text)'
            : task.priority === 'medium'
            ? 'var(--priority-medium-text)'
            : 'var(--brand-primary)'
        }`,
        opacity: task.status === 'completed' ? 0.75 : 1,
      }}
    >
      <div className="task-card-container">
        {/* Header Block */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="task-card-category">{task.category}</span>
            <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          </div>

          <div className="task-card-header">
            <button
              onClick={() => toggleTaskStatus(task._id, task.status)}
              className="btn-icon"
              style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: task.status === 'completed' ? 'var(--status-completed-text)' : 'var(--text-muted)' }}
              title={task.status === 'completed' ? 'Mark pending' : 'Mark completed'}
            >
              {task.status === 'completed' ? (
                <CheckCircle size={22} fill="var(--status-completed-bg)" />
              ) : (
                <Circle size={22} />
              )}
            </button>
            <div style={{ flexGrow: 1, marginLeft: '0.5rem' }}>
              <h3 className={`task-card-title ${task.status === 'completed' ? 'completed' : ''}`}>
                {task.title}
              </h3>
            </div>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <p className="task-card-description">{task.description || 'No description provided.'}</p>
          </div>
        </div>

        {/* Footer actions & indicators */}
        <div className="task-card-footer">
          <div className={`task-card-due ${isOverdue() ? 'overdue' : ''}`}>
            {isOverdue() ? <AlertTriangle size={12} /> : <Calendar size={12} />}
            <span>
              {isOverdue() ? `Overdue: ${formatDate(task.dueDate)}` : formatDate(task.dueDate)}
            </span>
          </div>

          <div className="task-card-actions">
            <button
              className="btn-icon"
              onClick={() => setIsEditing(true)}
              title="Edit Task"
              disabled={task.status === 'completed'}
              style={{ opacity: task.status === 'completed' ? 0.5 : 1, cursor: task.status === 'completed' ? 'not-allowed' : 'pointer' }}
            >
              <Edit2 size={14} />
            </button>
            <button
              className="btn-icon"
              style={{ color: 'var(--priority-high-text)' }}
              onClick={() => deleteTask(task._id)}
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
