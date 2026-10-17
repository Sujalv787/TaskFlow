export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateRelative = (date) => {
  if (!date) return '';
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((d - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff < 0) return `${Math.abs(diff)} days ago`;
  return `In ${diff} days`;
};

export const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date() ;
};

export const getPriorityColor = (priority) => {
  const colors = {
    low: { bg: 'var(--priority-low-bg)', text: 'var(--priority-low)', border: 'var(--priority-low)' },
    medium: { bg: 'var(--priority-medium-bg)', text: 'var(--priority-medium)', border: 'var(--priority-medium)' },
    high: { bg: 'var(--priority-high-bg)', text: 'var(--priority-high)', border: 'var(--priority-high)' },
    urgent: { bg: 'var(--priority-urgent-bg)', text: 'var(--priority-urgent)', border: 'var(--priority-urgent)' },
  };
  return colors[priority] || colors.medium;
};

export const getStatusColor = (status) => {
  const colors = {
    pending: { bg: 'var(--status-pending-bg)', text: 'var(--status-pending)' },
    'in-progress': { bg: 'var(--status-inprogress-bg)', text: 'var(--status-inprogress)' },
    completed: { bg: 'var(--status-completed-bg)', text: 'var(--status-completed)' },
    cancelled: { bg: 'var(--status-cancelled-bg)', text: 'var(--status-cancelled)' },
  };
  return colors[status] || colors.pending;
};

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
