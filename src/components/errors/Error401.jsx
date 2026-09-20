import React from 'react';
import { Link } from 'react-router-dom';

const Error401 = () => {
  return (
    <div className="container py-5 my-5 text-center">
      <div className="glass-card p-5 max-w-lg mx-auto" style={{ maxWidth: '600px' }}>
        <div className="display-1 fw-bold text-warning mb-3">
          <i className="bi bi-shield-lock"></i>
        </div>
        <h1 className="brand-font fw-bold mb-3">401 - Authentication Required</h1>
        <p className="text-muted mb-4 fs-5">
          You must be logged into your GovSmart citizen or officer account to access this secure government portal page.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/login" className="btn btn-gov-primary px-4 py-2">
            <i className="bi bi-box-arrow-in-right me-2"></i> Citizen Login
          </Link>
          <Link to="/" className="btn btn-outline-secondary px-4 py-2">
            <i className="bi bi-house me-2"></i> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error401;
