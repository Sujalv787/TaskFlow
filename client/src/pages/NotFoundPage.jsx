import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', textAlign: 'center', padding: 24,
      }}
    >
      <div style={{ fontSize: 80, marginBottom: 16 }}>404</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Page not found</h1>
      <p className="text-secondary mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;
