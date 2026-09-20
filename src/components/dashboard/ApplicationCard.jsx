import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import ApplicationTimeline from './ApplicationTimeline';
import { formatDate } from '../../utils/formatters';

const ApplicationCard = ({ application }) => {
  const [showTimelineModal, setShowTimelineModal] = useState(false);

  return (
    <>
      <div className="card glass-card border-0 p-4 mb-3">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3 pb-3 border-bottom">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill mb-1">
              Application ID: #{application._id.slice(-6).toUpperCase()}
            </span>
            <h5 className="brand-font fw-bold mb-1">
              <Link
                to={`/schemes/${application.scheme?._id}`}
                className="text-decoration-none text-main"
              >
                {application.scheme?.title || 'Government Scheme'}
              </Link>
            </h5>
            <small className="text-muted d-block">
              <i className="bi bi-calendar-check me-1"></i> Submitted on {formatDate(application.createdAt)}
            </small>
          </div>

          <div className="d-flex align-items-center gap-3">
            <StatusBadge status={application.status} />

            <button
              onClick={() => setShowTimelineModal(true)}
              className="btn btn-gov-primary btn-sm px-3 py-2 d-flex align-items-center gap-2"
            >
              <i className="bi bi-geo-alt-fill"></i> Track Status
            </button>
          </div>
        </div>

        <div className="row g-3 text-muted small">
          <div className="col-md-4">
            <strong>Applicant:</strong> {application.applicantName}
          </div>
          <div className="col-md-4">
            <strong>State:</strong> {application.state}
          </div>
          <div className="col-md-4">
            <strong>Category:</strong> {application.category}
          </div>
          {application.remarks && (
            <div className="col-12 mt-2 pt-2 border-top">
              <strong>Latest Officer Remarks:</strong>{' '}
              <span className="text-main fw-semibold">{application.remarks}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tracking Modal */}
      {showTimelineModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(5px)' }}
          role="dialog"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content glass-card border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
                <div>
                  <span className="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill mb-1">
                    Application #{application._id.slice(-6).toUpperCase()}
                  </span>
                  <h5 className="modal-title brand-font fw-bold mb-0">
                    4-Stage Application Tracking Timeline
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setShowTimelineModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <ApplicationTimeline
                  timeline={application.timeline}
                  currentStatus={application.status}
                />
              </div>

              <div className="modal-footer border-top py-3 px-4">
                <button
                  type="button"
                  className="btn btn-gov-primary px-4"
                  onClick={() => setShowTimelineModal(false)}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationCard;
