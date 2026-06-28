import React, { useContext, useState, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Search } from 'lucide-react';

const Toolbar = () => {
  const { filters, setFilters } = useContext(TaskContext);
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce search input to avoid hitting API on every keystroke
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, setFilters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="card toolbar-card">
      {/* Search Input */}
      <div className="search-input-wrapper">
        <Search className="search-icon-inside" size={16} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Filter and Sort Selectors */}
      <div className="filter-controls">
        {/* Filter by Status */}
        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        {/* Filter by Priority */}
        <select
          className="filter-select"
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        {/* Sorting options */}
        <select
          className="filter-select"
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
          }}
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="dueDate-asc">Due Date (Asc)</option>
          <option value="dueDate-desc">Due Date (Desc)</option>
        </select>
      </div>
    </div>
  );
};

export default Toolbar;
