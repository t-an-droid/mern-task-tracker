import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

const StatsPanel = () => {
  const { tasks } = useContext(TaskContext);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: 'var(--status-completed-text)' }}>
            {completed}
          </span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: 'var(--status-pending-text)' }}>
            {pending}
          </span>
          <span className="stat-label">Pending</span>
        </div>
      </div>

      <div className="progress-bar-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="stat-label">Completion Status</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
            {completionRate}%
          </span>
        </div>
        <div className="progress-track" aria-valuenow={completionRate} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
