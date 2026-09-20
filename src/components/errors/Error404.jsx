import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div className="container py-5 my-5 text-center">
      <div className="glass-card p-5 max-w-lg mx-auto" style={{ maxWidth: '600px' }}>
        <div className="display-1 fw-bold text-info mb-3">
          <i className="bi bi-compass"></i>
        </div>
        <h1 className="brand-font fw-bold mb-3">404 - Page Not Found</h1>
        <p className="text-muted mb-4 fs-5">
          The requested Government Scheme or page could not be located on the GovSmart India server. It may have been archived or moved.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/schemes" className="btn btn-gov-accent px-4 py-2">
            <i className="bi bi-search me-2"></i> Browse All Schemes
          </Link>
          <Link to="/" className="btn btn-outline-secondary px-4 py-2">
            <i className="bi bi-house me-2"></i> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error404;
