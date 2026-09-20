import React, { useState } from 'react';
import { toast } from 'react-toastify';
import applicationService from '../../services/applicationService';
import StatusBadge from '../common/StatusBadge';
import ApplicationTimeline from '../dashboard/ApplicationTimeline';
import { formatDate } from '../../utils/formatters';

const ApplicationReviewModal = ({ show, onClose, application, onSuccess }) => {
  const [status, setStatus] = useState(application?.status || 'Submitted');
  const [remarks, setRemarks] = useState(
    application?.remarks || 'Application under official government review.'
  );
  const [loading, setLoading] = useState(false);

  if (!show || !application) return null;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await applicationService.updateApplicationStatus(
        application._id,
        status,
        remarks
      );
      toast.success(`Application #${application._id.slice(-6).toUpperCase()} updated to ${status}!`);
      if (onSuccess) onSuccess(updated.data);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update application verification status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)' }}
      role="dialog"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content glass-card border-0 rounded-4 shadow-lg">
          {/* Modal Header */}
          <div className="modal-header border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
            <div>
              <span className="badge bg-danger text-white rounded-pill mb-1">
                Officer Verification Command
              </span>
              <h5 className="modal-title brand-font fw-bold mb-0">
                Application Review #{application._id.slice(-6).toUpperCase()} —{' '}
                {application.scheme?.title}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Left Column: Applicant Dossier & Documents */}
              <div className="col-lg-7">
                <div className="card glass-card border-0 p-4 mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                    <h6 className="brand-font fw-bold mb-0">
                      Applicant KYC Demographic Declaration
                    </h6>
                    <StatusBadge status={application.status} />
                  </div>

                  <div className="row g-3 small text-main">
                    <div className="col-md-6">
                      <strong>Applicant Name:</strong> {application.applicantName}
                    </div>
                    <div className="col-md-6">
                      <strong>12-Digit Aadhaar:</strong> {application.aadharNumber}
                    </div>
                    <div className="col-md-6">
                      <strong>10-Digit Mobile:</strong> {application.phone}
                    </div>
                    <div className="col-md-6">
                      <strong>Email Address:</strong> {application.email}
                    </div>
                    <div className="col-md-6">
                      <strong>State / UT:</strong> {application.state}
                    </div>
                    <div className="col-md-6">
                      <strong>District:</strong> {application.district || 'Not specified'}
                    </div>
                    <div className="col-md-6">
                      <strong>Occupation:</strong> {application.occupation}
                    </div>
                    <div className="col-md-6">
                      <strong>Annual Income:</strong> ₹{application.annualIncome?.toLocaleString('en-IN')}
                    </div>
                    <div className="col-md-6">
                      <strong>Social Category:</strong> {application.category}
                    </div>
                    <div className="col-md-6">
                      <strong>Submission Date:</strong> {formatDate(application.createdAt)}
                    </div>
                    <div className="col-12">
                      <strong>Residential Address:</strong> {application.address || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Attached Supporting Documents */}
                <div className="card glass-card border-0 p-4">
                  <h6 className="brand-font fw-bold mb-3 border-bottom pb-2">
                    Submitted Supporting Verification Documents
                  </h6>

                  {(!application.documents || application.documents.length === 0) ? (
                    <p className="text-muted small mb-0">
                      No documents were uploaded with this application.
                    </p>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {application.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-card border"
                        >
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-file-earmark-pdf-fill text-danger fs-4"></i>
                            <div>
                              <strong className="d-block small">{doc.fileName}</strong>
                              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                Uploaded on {formatDate(doc.uploadedAt)}
                              </small>
                            </div>
                          </div>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                          >
                            <i className="bi bi-box-arrow-up-right"></i> Inspect File
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Update Status Form & 4-Stage Timeline */}
              <div className="col-lg-5">
                <form onSubmit={handleSubmitReview} className="card glass-card border-0 p-4 mb-4">
                  <h6 className="brand-font fw-bold mb-3 text-warning border-bottom pb-2">
                    <i className="bi bi-shield-check me-2"></i> Update 4-Stage Tracking Status
                  </h6>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Verification Step Status *
                    </label>
                    <select
                      className="form-select fw-bold"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Submitted">1. Submitted (Pending Initial Review)</option>
                      <option value="Under Verification">2. Under Verification (Officer Review)</option>
                      <option value="Document Verified">3. Document Verified (Passed Inspection)</option>
                      <option value="Approved">4. Approved (Benefits Authorized)</option>
                      <option value="Rejected">5. Rejected (Does Not Meet Criteria)</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Official Officer Remarks & Instructions *
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      required
                    ></textarea>
                    <small className="text-muted">
                      This remark is visible to the citizen in their 4-Stage Application Timeline.
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gov-primary w-100 py-2 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating Status...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-1"></i> Save Status & Notify Citizen
                      </>
                    )}
                  </button>
                </form>

                {/* Existing Timeline */}
                <div className="card glass-card border-0 p-4">
                  <ApplicationTimeline
                    timeline={application.timeline}
                    currentStatus={application.status}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top py-3 px-4">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReviewModal;
