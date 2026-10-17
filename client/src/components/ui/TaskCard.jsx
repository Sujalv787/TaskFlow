import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, Edit2, Trash2 } from 'lucide-react';
import {
  formatDate,
  isOverdue,
  getPriorityColor,
  getStatusColor,
  getInitials,
} from '../../utils/helpers';

const TaskCard = memo(({ task, onDelete }) => {
  const navigate = useNavigate();
  const priorityColor = getPriorityColor(task.priority);
  const statusColor = getStatusColor(task.status);
  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

  const handleCardClick = () => navigate(`/tasks/${task._id}`);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task._id, task.title);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/tasks/${task._id}/edit`);
  };

  return (
    <div
      className={`task-card priority-${task.priority}`}
      onClick={handleCardClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      {/* Header */}
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button className="btn btn-ghost btn-sm" onClick={handleEdit} title="Edit" style={{ padding: '5px' }}>
            <Edit2 size={14} />
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete} title="Delete" style={{ padding: '5px' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {/* Meta badges */}
      <div className="task-meta">
        <span
          className="badge"
          style={{
            background: statusColor.bg,
            color: statusColor.text,
          }}
        >
          {task.status === 'in-progress' ? 'In Progress' :
           task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
        <span
          className="badge"
          style={{
            background: priorityColor.bg,
            color: priorityColor.text,
          }}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      {/* Footer */}
      <div className="task-footer">
        <div className="task-assignee">
          {task.assignedTo ? (
            <>
              <div className="avatar">{getInitials(task.assignedTo.name)}</div>
              <span>{task.assignedTo.name}</span>
            </>
          ) : (
            <>
              <User size={14} />
              <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
            </>
          )}
        </div>

        <div
          className={`flex items-center gap-1 text-xs ${overdue ? 'overdue-text' : 'text-muted'}`}
        >
          <Clock size={12} />
          <span>{overdue ? '⚠ ' : ''}{formatDate(task.dueDate)}</span>
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
export default TaskCard;
