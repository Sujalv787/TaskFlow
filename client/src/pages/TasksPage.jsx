import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTasks } from '../hooks/useTasks';
import { useDebounce } from '../hooks/useUtils';
import TaskCard from '../components/ui/TaskCard';
import SearchFilterBar from '../components/ui/SearchFilterBar';
import Pagination from '../components/ui/Pagination';

const TasksPage = () => {
  const navigate = useNavigate();
  const {
    tasks, pagination, loading, filters,
    loadTasks, removeTask, updateFilters, resetFilters,
  } = useTasks();

  const debouncedSearch = useDebounce(filters.search, 400);

  // Load tasks when debounced search or filters change
  useEffect(() => {
    loadTasks({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch, filters.status, filters.priority, filters.sortBy, filters.sortOrder, loadTasks]);

  const handlePageChange = useCallback(
    (page) => loadTasks({ page }),
    [loadTasks]
  );

  const handleDelete = useCallback(async (id, title) => {
    if (!window.confirm(`Delete task "${title}"? This cannot be undone.`)) return;
    const result = await removeTask(id);
    if (result.success) {
      toast.success('Task deleted successfully!');
      loadTasks({ page: pagination.page });
    } else {
      toast.error(result.error || 'Failed to delete task');
    }
  }, [removeTask, loadTasks, pagination.page]);

  const handleFiltersChange = useCallback((newFilters) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
    loadTasks({ search: '', status: '', priority: '', sortBy: 'createdAt', sortOrder: 'desc', page: 1 });
  }, [resetFilters, loadTasks]);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="tasks-header">
        <div>
          <h2 className="tasks-title">Tasks</h2>
          <p className="text-secondary text-sm">
            {pagination.total > 0 ? `${pagination.total} task${pagination.total !== 1 ? 's' : ''}` : 'No tasks found'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/tasks/new')} id="new-task-btn">
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <SearchFilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="grid-tasks">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 180, borderRadius: 16 }} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">
            {filters.search || filters.status || filters.priority
              ? 'No tasks match your filters'
              : 'No tasks yet'}
          </div>
          <div className="empty-desc mb-4">
            {filters.search || filters.status || filters.priority
              ? 'Try adjusting your search or clearing the filters.'
              : 'Create your first task to get started.'}
          </div>
          {!filters.search && !filters.status && !filters.priority && (
            <button className="btn btn-primary" onClick={() => navigate('/tasks/new')}>
              <Plus size={16} /> Create Task
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid-tasks">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination */}
          <div style={{ marginTop: 24 }}>
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        </>
      )}
    </div>
  );
};

export default TasksPage;
