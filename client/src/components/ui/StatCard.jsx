import React, { memo } from 'react';

const StatCard = memo(({ icon, label, value, type, trend }) => {
  return (
    <div className={`stat-card ${type}`}>
      <div
        className="stat-icon"
        style={{
          background:
            type === 'total' ? 'var(--primary-bg)' :
            type === 'pending' ? 'var(--status-pending-bg)' :
            type === 'inprogress' ? 'var(--status-inprogress-bg)' :
            'var(--status-completed-bg)',
        }}
      >
        {icon}
      </div>
      <div className="stat-value">{value ?? '—'}</div>
      <div className="stat-label">{label}</div>
      {trend !== undefined && (
        <div
          className="text-xs mt-2"
          style={{ color: trend >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}
        >
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
        </div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';
export default StatCard;
