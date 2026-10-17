import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/helpers';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 6 characters', valid: password.length >= 6 },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'Number', valid: /\d/.test(password) },
    { label: 'Special character (@$!%*?&)', valid: /[@$!%*?&]/.test(password) },
  ];
  const strength = checks.filter((c) => c.valid).length;
  const colors = ['', '#ff4d6a', '#ff8c42', '#ffd166', '#3b9eff', '#00d4a1'];

  if (!password) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= strength ? colors[strength] : 'var(--border-color)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
      {checks.map((c, i) => (
        <div key={i} className="flex items-center gap-2 text-xs" style={{ marginBottom: 2, color: c.valid ? 'var(--accent-green)' : 'var(--text-muted)' }}>
          <Check size={10} style={{ opacity: c.valid ? 1 : 0.3 }} />
          {c.label}
        </div>
      ))}
    </div>
  );
};

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = useCallback(() => {
    const errs = {};
    if (!form.name || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email) errs.email = 'Email is required';
    else if (!validateEmail(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (!validatePassword(form.password)) errs.password = 'Password does not meet requirements';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }, [form]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const result = await register({ name: form.name, email: form.email, password: form.password });
    if (!result.success) setServerError(result.error || 'Registration failed');
  }, [form, register, validate]);

  return (
    <div className="auth-page">
      <div className="auth-bg-glow" />
      <div className="auth-bg-glow-2" />

      <div className="auth-card fade-in" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>TaskFlow</div>
            <div className="text-xs text-muted">Team Management Platform</div>
          </div>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join your team on TaskFlow today</p>

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
          {/* Name */}
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">Full Name</label>
            <input
              id="reg-name"
              type="text"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.name && <span className="form-error"><AlertCircle size={12} />{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email Address</label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password" className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error"><AlertCircle size={12} />{errors.password}</span>}
            <PasswordStrength password={form.password} />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
            <input
              id="reg-confirm"
              type="password"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="form-error"><AlertCircle size={12} />{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            id="register-submit"
          >
            {loading ? <span className="spinner spinner-sm" /> : null}
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-divider" style={{ marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in →</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
