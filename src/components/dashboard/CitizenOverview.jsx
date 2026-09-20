import React from 'react';
import { Link } from 'react-router-dom';

const CitizenOverview = ({ user, applications = [], onOpenEligibilityWizard, onTabChange }) => {
  const totalApps = applications.length;
  const inProgressApps = applications.filter((a) =>
    ['Submitted', 'Under Verification', 'Document Verified'].includes(a.status)
  ).length;
  const approvedApps = applications.filter((a) => a.status === 'Approved').length;
  const savedCount = user?.savedSchemes?.length || 0;

  return (
    <div>
      {/* Welcome Hero Strip */}
      <div className="glass-card p-4 mb-4 gradient-header text-white border-0 position-relative overflow-hidden">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 position-relative z-1">
          <div>
            <span className="badge bg-white text-dark rounded-pill px-3 py-1 fw-bold mb-2">
              <i className="bi bi-person-check-fill me-1"></i> Citizen Portal
            </span>
            <h3 className="brand-font fw-bold mb-1">
              Welcome back, {user?.name}!
            </h3>
            <p className="mb-0 opacity-75 small">
              Manage your scheme applications, track government document verification, and discover welfare programs.
            </p>
          </div>
          <button
            onClick={onOpenEligibilityWizard}
            className="btn btn-warning text-dark fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
          >
            <i className="bi bi-magic fs-5"></i> Check Eligibility Wizard
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div
            className="card glass-card border-0 p-4 h-100 cursor-pointer"
            onClick={() => onTabChange('applications')}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-semibold">TOTAL APPLICATIONS</span>
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                style={{ width: '42px', height: '42px' }}
              >
                <i className="bi bi-folder-fill fs-5"></i>
              </div>
            </div>
            <h2 className="brand-font fw-bold mb-0">{totalApps}</h2>
            <small className="text-muted">Submitted on portal</small>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div
            className="card glass-card border-0 p-4 h-100 cursor-pointer"
            onClick={() => onTabChange('applications')}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-semibold">IN PROGRESS / REVIEW</span>
              <div
                className="rounded-circle bg-warning-subtle text-dark d-flex align-items-center justify-content-center"
                style={{ width: '42px', height: '42px' }}
              >
                <i className="bi bi-hourglass-split fs-5"></i>
              </div>
            </div>
            <h2 className="brand-font fw-bold mb-0 text-warning">{inProgressApps}</h2>
            <small className="text-muted">4-stage tracking active</small>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div
            className="card glass-card border-0 p-4 h-100 cursor-pointer"
            onClick={() => onTabChange('applications')}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-semibold">APPROVED BENEFITS</span>
              <div
                className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
                style={{ width: '42px', height: '42px' }}
              >
                <i className="bi bi-check-circle-fill fs-5"></i>
              </div>
            </div>
            <h2 className="brand-font fw-bold mb-0 text-success">{approvedApps}</h2>
            <small className="text-muted">Successfully verified</small>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div
            className="card glass-card border-0 p-4 h-100 cursor-pointer"
            onClick={() => onTabChange('saved')}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-semibold">SAVED SCHEMES</span>
              <div
                className="rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center"
                style={{ width: '42px', height: '42px' }}
              >
                <i className="bi bi-bookmark-heart-fill fs-5"></i>
              </div>
            </div>
            <h2 className="brand-font fw-bold mb-0 text-danger">{savedCount}</h2>
            <small className="text-muted">Bookmarked schemes</small>
          </div>
        </div>
      </div>

      {/* Quick Profile Summary Card */}
      <div className="card glass-card border-0 p-4">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <h5 className="brand-font fw-bold mb-0">My Demographic Profile Summary</h5>
          <button
            onClick={() => onTabChange('profile')}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
          >
            <i className="bi bi-pencil-square"></i> Edit KYC Profile
          </button>
        </div>

        <div className="row g-3 text-muted">
          <div className="col-md-4">
            <strong>State:</strong> {user?.state || 'N/A'}
          </div>
          <div className="col-md-4">
            <strong>District:</strong> {user?.district || 'Not Specified'}
          </div>
          <div className="col-md-4">
            <strong>Occupation:</strong> {user?.occupation || 'Farmer'}
          </div>
          <div className="col-md-4">
            <strong>Annual Income:</strong> ₹{user?.annualIncome ? user.annualIncome.toLocaleString('en-IN') : '0'}
          </div>
          <div className="col-md-4">
            <strong>Category:</strong> {user?.category || 'General'}
          </div>
          <div className="col-md-4">
            <strong>Disability Status:</strong> {user?.disabilityStatus ? 'Yes (40%+)' : 'No'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenOverview;
