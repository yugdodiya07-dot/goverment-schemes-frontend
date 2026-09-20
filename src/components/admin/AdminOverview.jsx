import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/formatters';

const AdminOverview = ({ statsData, onTabChange }) => {
  const { stats, recentRegistrations = [], recentApplications = [] } = statsData || {};

  return (
    <div>
      {/* Officer Banner */}
      <div
        className="glass-card p-4 mb-4 text-white border-0 position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0b1323 0%, #1e293b 60%, #0f3057 100%)' }}
      >
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <span className="badge bg-danger text-white rounded-pill px-3 py-1 fw-bold mb-2">
              <i className="bi bi-shield-lock-fill me-1"></i> Officer Administration Command Center
            </span>
            <h3 className="brand-font fw-bold mb-1">
              National Portal Executive Overview
            </h3>
            <p className="mb-0 opacity-75 small">
              Real-time analytics across citizen registrations, scheme directories, and multi-stage verification workflows.
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={() => onTabChange('schemes')}
              className="btn btn-gov-accent px-4 py-2 rounded-pill fw-bold"
            >
              <i className="bi bi-plus-circle me-1"></i> Manage Schemes
            </button>
            <button
              onClick={() => onTabChange('applications')}
              className="btn btn-outline-light px-4 py-2 rounded-pill fw-semibold"
            >
              <i className="bi bi-clipboard-check me-1"></i> Verify Applications
            </button>
          </div>
        </div>
      </div>

      {/* 8 Analytics Cards */}
      <div className="row g-3 mb-5">
        <div className="col-sm-6 col-lg-3">
          <div
            className="card glass-card border-0 p-3 h-100 cursor-pointer"
            onClick={() => onTabChange('users')}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">TOTAL CITIZENS</span>
              <i className="bi bi-people-fill fs-5 text-primary"></i>
            </div>
            <h3 className="brand-font fw-bold mb-0">{stats?.totalUsers || 0}</h3>
            <small className="text-muted">Registered accounts</small>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div
            className="card glass-card border-0 p-3 h-100 cursor-pointer"
            onClick={() => onTabChange('users')}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">ACTIVE ACCOUNTS</span>
              <i className="bi bi-person-check-fill fs-5 text-success"></i>
            </div>
            <h3 className="brand-font fw-bold mb-0 text-success">{stats?.activeUsers || 0}</h3>
            <small className="text-muted">Verified citizens</small>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div
            className="card glass-card border-0 p-3 h-100 cursor-pointer"
            onClick={() => onTabChange('users')}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">BLOCKED CITIZENS</span>
              <i className="bi bi-person-slash fs-5 text-danger"></i>
            </div>
            <h3 className="brand-font fw-bold mb-0 text-danger">{stats?.blockedUsers || 0}</h3>
            <small className="text-muted">Suspended from login</small>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div
            className="card glass-card border-0 p-3 h-100 cursor-pointer"
            onClick={() => onTabChange('schemes')}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">ACTIVE SCHEMES</span>
              <i className="bi bi-folder2-open fs-5 text-warning"></i>
            </div>
            <h3 className="brand-font fw-bold mb-0 text-warning">{stats?.totalSchemes || 0}</h3>
            <small className="text-muted">Government programs</small>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div
            className="card glass-card border-0 p-3 h-100 cursor-pointer"
            onClick={() => onTabChange('applications')}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">TOTAL APPLICATIONS</span>
              <i className="bi bi-files fs-5 text-info"></i>
            </div>
            <h3 className="brand-font fw-bold mb-0 text-info">{stats?.totalApplications || 0}</h3>
            <small className="text-muted">Portal submissions</small>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div
            className="card glass-card border-0 p-3 h-100 cursor-pointer"
            onClick={() => onTabChange('applications')}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">PENDING REVIEW</span>
              <i className="bi bi-clock-history fs-5 text-warning"></i>
            </div>
            <h3 className="brand-font fw-bold mb-0 text-warning">{stats?.pendingApplications || 0}</h3>
            <small className="text-muted">Under Officer Verification</small>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div
            className="card glass-card border-0 p-3 h-100 cursor-pointer"
            onClick={() => onTabChange('applications')}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">APPROVED BENEFITS</span>
              <i className="bi bi-check-circle-fill fs-5 text-success"></i>
            </div>
            <h3 className="brand-font fw-bold mb-0 text-success">{stats?.approvedApplications || 0}</h3>
            <small className="text-muted">Fully verified & disbursed</small>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div
            className="card glass-card border-0 p-3 h-100 cursor-pointer"
            onClick={() => onTabChange('applications')}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">REJECTED</span>
              <i className="bi bi-x-circle-fill fs-5 text-danger"></i>
            </div>
            <h3 className="brand-font fw-bold mb-0 text-danger">{stats?.rejectedApplications || 0}</h3>
            <small className="text-muted">Did not meet criteria</small>
          </div>
        </div>
      </div>

      {/* Two Recent Tables */}
      <div className="row g-4">
        {/* Recent Applications Table */}
        <div className="col-lg-7">
          <div className="card glass-card border-0 p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h6 className="brand-font fw-bold mb-0">Recent Citizen Scheme Submissions</h6>
              <button
                onClick={() => onTabChange('applications')}
                className="btn btn-sm btn-link text-decoration-none fw-semibold"
              >
                View All Applications &rarr;
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="text-muted small">
                    <th>Applicant / Scheme</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted">
                        No recent applications found.
                      </td>
                    </tr>
                  ) : (
                    recentApplications.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <div className="fw-bold">{app.applicantName}</div>
                          <small className="text-muted">{app.scheme?.title}</small>
                        </td>
                        <td className="small">{formatDate(app.createdAt)}</td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="col-lg-5">
          <div className="card glass-card border-0 p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h6 className="brand-font fw-bold mb-0">Recent Citizen Registrations</h6>
              <button
                onClick={() => onTabChange('users')}
                className="btn btn-sm btn-link text-decoration-none fw-semibold"
              >
                View Directory &rarr;
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="text-muted small">
                    <th>Citizen Name</th>
                    <th>State</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted">
                        No citizens registered yet.
                      </td>
                    </tr>
                  ) : (
                    recentRegistrations.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div className="fw-bold">{u.name}</div>
                          <small className="text-muted">{u.email}</small>
                        </td>
                        <td className="small">{u.state}</td>
                        <td>
                          <StatusBadge status={u.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
