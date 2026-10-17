import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../utils/helpers';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = useCallback(() => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!validateEmail(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  }, [form]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const result = await login(form);
    if (!result.success) setServerError(result.error || 'Login failed');
  }, [form, login, validate]);

  return (
    <div className="auth-page">
      <div className="auth-bg-glow" />
      <div className="auth-bg-glow-2" />

      <div className="auth-card fade-in">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>TaskFlow</div>
            <div className="text-xs text-muted">Team Management Platform</div>
          </div>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {serverError && (
          <div
            className="flex items-center gap-2"
            style={{
              background: 'rgba(255,77,106,0.1)', border: '1px solid rgba(255,77,106,0.25)',
              borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 16,
              color: 'var(--accent-red)', fontSize: 14,
            }}
          >
            <AlertCircle size={16} />
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="form-error"><AlertCircle size={12} />{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error"><AlertCircle size={12} />{errors.password}</span>}
          </div>

          {/* Remember Me */}
          <label className="remember-me" htmlFor="remember-me">
            <input
              id="remember-me"
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
            />
            Remember me for 30 days
          </label>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            id="login-submit"
          >
            {loading ? <span className="spinner spinner-sm" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-divider" style={{ marginTop: 24 }}>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one →</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
