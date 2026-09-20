import React from 'react';
import { Link } from 'react-router-dom';

const Error500 = () => {
  return (
    <div className="container py-5 my-5 text-center">
      <div className="glass-card p-5 max-w-lg mx-auto" style={{ maxWidth: '600px' }}>
        <div className="display-1 fw-bold text-danger mb-3">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h1 className="brand-font fw-bold mb-3">500 - Internal Server Error</h1>
        <p className="text-muted mb-4 fs-5">
          Our Government National Welfare Portal servers encountered an unexpected issue. Our technical team has been notified.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <button onClick={() => window.location.reload()} className="btn btn-gov-primary px-4 py-2">
            <i className="bi bi-arrow-clockwise me-2"></i> Reload Page
          </button>
          <Link to="/" className="btn btn-outline-secondary px-4 py-2">
            <i className="bi bi-house me-2"></i> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error500;
