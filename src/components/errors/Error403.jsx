import React from 'react';
import { Link } from 'react-router-dom';

const Error403 = () => {
  return (
    <div className="container py-5 my-5 text-center">
      <div className="glass-card p-5 max-w-lg mx-auto" style={{ maxWidth: '600px' }}>
        <div className="display-1 fw-bold text-danger mb-3">
          <i className="bi bi-person-fill-slash"></i>
        </div>
        <h1 className="brand-font fw-bold mb-3">403 - Access Forbidden</h1>
        <p className="text-muted mb-4 fs-5">
          Restricted Government Area. This section is reserved exclusively for authorized Government Officers and Portal Administrators.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/dashboard" className="btn btn-gov-primary px-4 py-2">
            <i className="bi bi-speedometer2 me-2"></i> Citizen Dashboard
          </Link>
          <Link to="/" className="btn btn-outline-secondary px-4 py-2">
            <i className="bi bi-house me-2"></i> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error403;
