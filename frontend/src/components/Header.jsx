import React from 'react';
import { CheckSquare } from 'lucide-react';

const Header = () => {
  return (
    <header className="header-wrapper">
      <div className="brand-section">
        <div className="brand-logo-icon">
          <CheckSquare size={24} />
        </div>
        <div>
          <h1>AuraTask</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Task Planner & Management Dashboard
          </p>
        </div>
      </div>
      <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
        <span className="badge badge-completed">Stable Version 1.0</span>
      </div>
    </header>
  );
};

export default Header;
