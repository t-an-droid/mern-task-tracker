import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import TaskCard from './TaskCard';
import { ClipboardList } from 'lucide-react';

const TaskList = () => {
  const { tasks, loading, error } = useContext(TaskContext);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ borderColor: 'var(--priority-high-border)', backgroundColor: 'var(--priority-high-bg)', textAlign: 'center' }}>
        <p style={{ color: 'var(--priority-high-text)', fontWeight: 600 }}>{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <ClipboardList size={48} />
        </div>
        <h3>No tasks found</h3>
        <p style={{ fontSize: '0.9rem', maxWidth: '300px' }}>
          Get started by adding a task on the left or try adjusting your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="tasks-list-grid">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
