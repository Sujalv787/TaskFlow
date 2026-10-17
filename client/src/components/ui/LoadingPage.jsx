import React from 'react';

const LoadingPage = () => (
  <div className="loading-page">
    <div
      style={{
        width: 56, height: 56,
        background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
        borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28,
        animation: 'pulse 1.5s ease infinite',
      }}
    >
      ⚡
    </div>
    <div className="spinner" />
    <p className="text-secondary text-sm">Loading TaskFlow...</p>
  </div>
);

export default LoadingPage;
