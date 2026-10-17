import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ArrowLeft, Tag, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTasks } from '../hooks/useTasks';
import { formatDate, formatDateRelative, isOverdue, getPriorityColor, getStatusColor, getInitials } from '../utils/helpers';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTask, taskLoading, loadTask, removeTask } = useTasks();

  useEffect(() => {
    loadTask(id);
  }, [id, loadTask]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    const result = await removeTask(id);
    if (result.success) {
      toast.success('Task deleted!');
      navigate('/tasks');
    } else {
      toast.error(result.error || 'Failed to delete task');
    }
  };

  if (taskLoading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 400 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="card empty-state">
        <div className="empty-icon">❓</div>
        <div className="empty-title">Task not found</div>
        <div className="empty-desc mb-4">This task may have been deleted or you don't have access.</div>
        <button className="btn btn-primary" onClick={() => navigate('/tasks')}>← Back to Tasks</button>
      </div>
    );
  }

  const priorityColor = getPriorityColor(currentTask.priority);
  const statusColor = getStatusColor(currentTask.status);
  const overdue = isOverdue(currentTask.dueDate) && currentTask.status !== 'completed';

  return (
    <div className="fade-in">
      {/* Back + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tasks')}>
          <ArrowLeft size={16} /> Back to Tasks
        </button>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/tasks/${id}/edit`)}>
            <Edit2 size={14} /> Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="task-detail-grid">
        {/* Main Content */}
        <div>
          <div className="detail-section">
            {/* Title & Status */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.3 }}>{currentTask.title}</h2>
              <span
                className="badge"
                style={{ background: statusColor.bg, color: statusColor.text, whiteSpace: 'nowrap' }}
              >
                {currentTask.status === 'in-progress' ? 'In Progress' :
                  currentTask.status.charAt(0).toUpperCase() + currentTask.status.slice(1)}
              </span>
            </div>

            {/* Description */}
            <div className="detail-label">Description</div>
            <p className="detail-value" style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {currentTask.description || <span className="text-muted">No description provided.</span>}
            </p>

            {/* Tags */}
            {currentTask.tags?.length > 0 && (
              <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {currentTask.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge"
                    style={{ background: 'var(--primary-bg)', color: 'var(--primary-light)' }}
                  >
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Created by */}
          <div className="detail-section">
            <div className="detail-label">Created by</div>
            {currentTask.createdBy ? (
              <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
                <div className="avatar">{getInitials(currentTask.createdBy.name)}</div>
                <div>
                  <div className="text-sm font-semibold">{currentTask.createdBy.name}</div>
                  <div className="text-xs text-muted">{currentTask.createdBy.email}</div>
                </div>
              </div>
            ) : (
              <p className="text-muted text-sm">Unknown</p>
            )}
          </div>
        </div>

        {/* Sidebar Meta */}
        <div>
          <div className="detail-section">
            <h3 className="text-sm font-bold" style={{ marginBottom: 20 }}>Task Details</h3>

            {/* Priority */}
            <div style={{ marginBottom: 16 }}>
              <div className="detail-label">Priority</div>
              <span
                className="badge"
                style={{ background: priorityColor.bg, color: priorityColor.text, marginTop: 6 }}
              >
                {currentTask.priority.charAt(0).toUpperCase() + currentTask.priority.slice(1)}
              </span>
            </div>

            {/* Due Date */}
            <div style={{ marginBottom: 16 }}>
              <div className="detail-label">Due Date</div>
              <div className={`flex items-center gap-2 text-sm mt-1 ${overdue ? 'overdue-text' : ''}`}>
                <Calendar size={14} />
                {formatDate(currentTask.dueDate)}
                <span className="text-xs text-muted">({formatDateRelative(currentTask.dueDate)})</span>
              </div>
              {overdue && <div className="text-xs overdue-text mt-1">⚠ This task is overdue!</div>}
            </div>

            {/* Assigned To */}
            <div style={{ marginBottom: 16 }}>
              <div className="detail-label">Assigned To</div>
              {currentTask.assignedTo ? (
                <div className="flex items-center gap-2" style={{ marginTop: 6 }}>
                  <div className="avatar">{getInitials(currentTask.assignedTo.name)}</div>
                  <div>
                    <div className="text-sm font-semibold">{currentTask.assignedTo.name}</div>
                    <div className="text-xs text-muted">{currentTask.assignedTo.email}</div>
                  </div>
                </div>
              ) : (
                <p className="text-muted text-sm mt-1">Unassigned</p>
              )}
            </div>

            {/* Timestamps */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
              <div className="detail-label">Created</div>
              <div className="text-sm mt-1">{formatDate(currentTask.createdAt)}</div>
              <div className="detail-label" style={{ marginTop: 12 }}>Last Updated</div>
              <div className="text-sm mt-1">{formatDate(currentTask.updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
