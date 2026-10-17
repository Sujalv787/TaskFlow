import React, { memo, useCallback } from 'react';
import { Search, RotateCcw, ArrowUpDown } from 'lucide-react';

const STATUSES = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITIES = [
  { value: '', label: 'All Priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const SORTS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

const SearchFilterBar = memo(({ filters, onFiltersChange, onReset }) => {
  const handleChange = useCallback(
    (key, value) => onFiltersChange({ [key]: value }),
    [onFiltersChange]
  );

  const toggleSortOrder = useCallback(
    () => onFiltersChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' }),
    [filters.sortOrder, onFiltersChange]
  );

  return (
    <div className="search-filter-bar">
      {/* Search */}
      <div className="search-input-wrapper">
        <Search className="search-icon" />
        <input
          id="task-search"
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <select
        id="status-filter"
        className="filter-select"
        value={filters.status}
        onChange={(e) => handleChange('status', e.target.value)}
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {/* Priority Filter */}
      <select
        id="priority-filter"
        className="filter-select"
        value={filters.priority}
        onChange={(e) => handleChange('priority', e.target.value)}
      >
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      {/* Sort By */}
      <select
        id="sort-filter"
        className="filter-select"
        value={filters.sortBy}
        onChange={(e) => handleChange('sortBy', e.target.value)}
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {/* Sort Order Toggle */}
      <button className="btn btn-secondary btn-sm" onClick={toggleSortOrder} title="Toggle sort order">
        <ArrowUpDown size={14} />
        {filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}
      </button>

      {/* Reset */}
      <button className="btn btn-ghost btn-sm" onClick={onReset} title="Reset filters">
        <RotateCcw size={14} />
      </button>
    </div>
  );
});

SearchFilterBar.displayName = 'SearchFilterBar';
export default SearchFilterBar;
