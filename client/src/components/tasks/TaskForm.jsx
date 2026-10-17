import React, { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

const STATUSES = ['pending', 'in-progress', 'completed', 'cancelled'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const TaskForm = memo(({ initialValues, onSubmit, loading, submitLabel }) => {
  const navigate = useNavigate();
  const users = useSelector((state) => state.auth.users);

  const [form, setForm] = useState(() => ({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    priority: initialValues?.priority || 'medium',
    status: initialValues?.status || 'pending',
    dueDate: initialValues?.dueDate
      ? new Date(initialValues.dueDate).toISOString().split('T')[0]
      : '',
    assignedTo: initialValues?.assignedTo?._id || initialValues?.assignedTo || '',
    tags: Array.isArray(initialValues?.tags) ? initialValues.tags.join(', ') : '',
  }));
  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    const errs = {};
    if (!form.title?.trim()) errs.title = 'Title is required';
    else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
    if (!form.dueDate) errs.dueDate = 'Due date is required';
    return errs;
  }, [form]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await onSubmit({
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      assignedTo: form.assignedTo || null,
    });
  }, [form, onSubmit, validate]);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'grid', gap: 20 }}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">Title *</label>
          <input
            id="task-title"
            type="text"
            name="title"
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter task title"
            value={form.title}
            onChange={handleChange}
            maxLength={100}
          />
          {errors.title && <span className="form-error"><AlertCircle size={12} />{errors.title}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="task-description" className="form-label">Description</label>
          <textarea
            id="task-description"
            name="description"
            className="form-input"
            placeholder="Describe the task..."
            value={form.description}
            onChange={handleChange}
            rows={4}
            maxLength={1000}
            style={{ resize: 'vertical', minHeight: 100 }}
          />
          <span className="text-xs text-muted" style={{ textAlign: 'right' }}>
            {form.description?.length || 0}/1000
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Priority */}
          <div className="form-group">
            <label htmlFor="task-priority" className="form-label">Priority</label>
            <select id="task-priority" name="priority" className="form-select" value={form.priority} onChange={handleChange}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="task-status" className="form-label">Status</label>
            <select id="task-status" name="status" className="form-select" value={form.status} onChange={handleChange}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label htmlFor="task-due-date" className="form-label">Due Date *</label>
            <input
              id="task-due-date"
              type="date"
              name="dueDate"
              className={`form-input ${errors.dueDate ? 'error' : ''}`}
              value={form.dueDate}
              onChange={handleChange}
            />
            {errors.dueDate && <span className="form-error"><AlertCircle size={12} />{errors.dueDate}</span>}
          </div>

          {/* Assigned To */}
          <div className="form-group">
            <label htmlFor="task-assigned" className="form-label">Assigned To</label>
            <select id="task-assigned" name="assignedTo" className="form-select" value={form.assignedTo} onChange={handleChange}>
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="task-tags" className="form-label">Tags (comma-separated)</label>
          <input
            id="task-tags"
            type="text"
            name="tags"
            className="form-input"
            placeholder="e.g. frontend, bug, urgent"
            value={form.tags}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading} id="task-submit-btn">
            {loading ? <span className="spinner spinner-sm" /> : null}
            {loading ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
});

TaskForm.displayName = 'TaskForm';
export default TaskForm;
