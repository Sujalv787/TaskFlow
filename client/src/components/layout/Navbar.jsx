import React, { memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocalStorage } from '../../hooks/useUtils';
import { getInitials } from '../../utils/helpers';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
  '/tasks/new': 'New Task',
};

const Navbar = memo(({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, [theme, setTheme]);

  const title =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.includes('/edit') ? 'Edit Task' : 'Task Detail');

  return (
    <header className="navbar">
      <div className="flex items-center gap-3">
        <button className="btn btn-ghost btn-sm" onClick={onMenuClick} style={{ padding: '8px', display: 'none' }} id="menu-btn">
          <Menu size={20} />
        </button>
        <h1 className="navbar-title">{title}</h1>
      </div>

      <div className="navbar-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <div className="flex items-center gap-2" style={{ padding: '6px 10px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div className="avatar">{getInitials(user?.name)}</div>
          <div>
            <div className="text-sm font-semibold">{user?.name}</div>
            <div className="text-xs text-muted">{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;
