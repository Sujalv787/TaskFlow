import React, { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Plus, LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
];

const Sidebar = memo(({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNewTask = () => {
    navigate('/tasks/new');
    onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚡</div>
        <span className="sidebar-logo-text">TaskFlow</span>
      </div>

      {/* New Task Button */}
      <div style={{ padding: '16px 12px 0' }}>
        <button className="btn btn-primary btn-full" onClick={handleNewTask}>
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Main</span>
        {NAV_LINKS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Icon className="sidebar-link-icon" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar avatar-lg">
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-semibold text-sm truncate">{user?.name}</div>
            <div className="text-xs text-muted truncate">{user?.role}</div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={logout}
            title="Logout"
            style={{ padding: '6px' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;
