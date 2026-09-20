import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import schemeService from '../services/schemeService';
import { useAuth } from '../hooks/useAuth';
import ApplicationModal from '../components/schemes/ApplicationModal';
import Loader from '../components/common/Loader';
import { calculateWeightedEligibility, getEligibilityBadgeProps } from '../utils/eligibilityCalculator';
import { formatDate } from '../utils/formatters';

const SchemeDetail = ({ onOpenEligibilityWizard }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    const fetchScheme = async () => {
      setLoading(true);
      try {
        const res = await schemeService.getSchemeById(id);
        setScheme(res.data);
      } catch (error) {
        toast.error('Failed to load scheme details. It may not exist.');
        navigate('/schemes');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchScheme();
  }, [id, navigate]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to bookmark schemes.');
      return navigate('/login');
    }
    try {
      const res = await schemeService.toggleBookmark(scheme._id);
      toast.success(res.message);
      if (refreshUser) refreshUser();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update bookmark.');
    }
  };

  const isBookmarked =
    isAuthenticated &&
    user?.savedSchemes?.some((item) =>
      typeof item === 'string' ? item === scheme?._id : item._id === scheme?._id
    );

  const matchPercentage =
    isAuthenticated && scheme ? calculateWeightedEligibility(user, scheme) : null;
  const badgeProps = matchPercentage !== null ? getEligibilityBadgeProps(matchPercentage) : null;

  if (loading) {
    return <Loader fullScreen text="Loading Government scheme specifications..." />;
  }

  if (!scheme) return null;

  return (
    <div className="container py-5 my-2">
      {/* Back Link */}
      <div className="mb-4">
        <Link to="/schemes" className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1">
          <i className="bi bi-arrow-left"></i> Back to Scheme Directory
        </Link>
      </div>

      <div className="row g-4">
        {/* Main Details Column */}
        <div className="col-lg-8">
          <div className="card glass-card border-0 p-4 p-lg-5 mb-4">
            {/* Header badges */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 fw-semibold">
                  {scheme.category}
                </span>
                <span className="badge bg-secondary-subtle text-muted rounded-pill px-3 py-2">
                  CODE: {scheme.code}
                </span>
              </div>

              {badgeProps && (
                <span className={`${badgeProps.badgeClass} px-3 py-2`}>
                  <i className="bi bi-patch-check-fill me-1"></i> {badgeProps.label}
                </span>
              )}
            </div>

            {/* Scheme Title & Ministry */}
            <h1 className="brand-font fw-extrabold mb-2" style={{ fontSize: '2.4rem' }}>
              {scheme.title}
            </h1>
            <p className="text-muted fw-semibold mb-4 fs-6">
              <i className="bi bi-building me-2 text-warning"></i>
              {scheme.ministry}
            </p>

            {/* Benefit Assistance Highlight Banner */}
            <div
              className="p-4 rounded-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3"
              style={{ backgroundColor: 'rgba(230, 126, 34, 0.1)', borderLeft: '5px solid var(--gov-accent)' }}
            >
              <div>
                <span className="small text-muted d-block fw-semibold">
                  PRIMARY BENEFIT / ASSISTANCE PROVIDED
                </span>
                <h4 className="brand-font fw-bold mb-0 text-main">{scheme.benefitAmount}</h4>
                <small className="text-muted">{scheme.benefitType}</small>
              </div>

              {scheme.applicationDeadline && (
                <div className="text-lg-end">
                  <span className="small text-muted d-block fw-semibold">APPLICATION DEADLINE</span>
                  <strong className="text-danger">
                    <i className="bi bi-calendar-x-fill me-1"></i>
                    {formatDate(scheme.applicationDeadline)}
                  </strong>
                </div>
              )}
            </div>

            {/* Short Summary */}
            <h5 className="brand-font fw-bold mb-2">Scheme Executive Summary</h5>
            <p className="text-muted mb-4 pe-lg-4">{scheme.shortDescription}</p>

            {/* Detailed Description */}
            <h5 className="brand-font fw-bold mb-3">Objectives, Scope & Benefits</h5>
            <p className="text-muted mb-4 pe-lg-4" style={{ whiteSpace: 'pre-line' }}>
              {scheme.detailedDescription}
            </p>

            {/* Required Verification Documents */}
            <h5 className="brand-font fw-bold mb-3">Required Documents for Application</h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {scheme.requiredDocuments?.map((doc, i) => (
                <span
                  key={i}
                  className="badge bg-card text-main border rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2"
                >
                  <i className="bi bi-file-earmark-check-fill text-success"></i>
                  {doc}
                </span>
              ))}
            </div>

            {/* Official Website Link */}
            {scheme.officialWebsite && (
              <div className="pt-3 border-top">
                <a
                  href={scheme.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                >
                  <i className="bi bi-globe2"></i> Visit Official Gov.IN Website{' '}
                  <i className="bi bi-box-arrow-up-right"></i>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Eligibility Rules Card & Action Buttons */}
        <div className="col-lg-4">
          <div className="card glass-card border-0 p-4 mb-4 sticky-top" style={{ top: '100px' }}>
            <h5 className="brand-font fw-bold mb-3 border-bottom pb-2">
              Eligibility & Demographics Criteria
            </h5>

            <ul className="list-unstyled d-flex flex-column gap-3 small mb-4">
              <li className="d-flex align-items-center justify-content-between">
                <span className="text-muted">Age Limits:</span>
                <strong>
                  {scheme.minAge || 18} to {scheme.maxAge || 65} Years
                </strong>
              </li>
              <li className="d-flex align-items-center justify-content-between">
                <span className="text-muted">Max Annual Income:</span>
                <strong>₹{scheme.maxIncome?.toLocaleString('en-IN') || 'No bar'}</strong>
              </li>
              <li className="d-flex align-items-center justify-content-between">
                <span className="text-muted">Gender Eligibility:</span>
                <strong>{scheme.gender || 'All Genders'}</strong>
              </li>
              <li className="d-flex align-items-center justify-content-between">
                <span className="text-muted">Eligible States:</span>
                <strong className="text-truncate" style={{ maxWidth: '160px' }}>
                  {scheme.eligibleStates?.join(', ') || 'PAN India'}
                </strong>
              </li>
              <li className="d-flex align-items-center justify-content-between">
                <span className="text-muted">Social Categories:</span>
                <strong>{scheme.eligibleCategories?.join(', ') || 'All'}</strong>
              </li>
              <li className="d-flex align-items-center justify-content-between">
                <span className="text-muted">Target Occupations:</span>
                <strong>{scheme.eligibleOccupations?.join(', ') || 'All'}</strong>
              </li>
            </ul>

            {badgeProps && (
              <div className="p-3 rounded-3 mb-4 bg-card border">
                <strong className="d-block small mb-1">Your Personal Match Result:</strong>
                <span className={`${badgeProps.badgeClass} d-inline-block mb-1`}>
                  {badgeProps.label}
                </span>
                <p className="text-muted small mb-0">{badgeProps.text}</p>
              </div>
            )}

            {/* Primary Apply Button */}
            <div className="d-flex flex-column gap-2">
              {isAuthenticated ? (
                <button
                  onClick={() => setShowApplicationModal(true)}
                  className="btn btn-gov-primary py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-send-check-fill fs-5"></i> Apply Now On GovSmart
                </button>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-gov-primary py-3 fw-bold shadow-sm text-center text-decoration-none"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i> Sign In to Apply
                </Link>
              )}

              <button
                onClick={handleBookmarkToggle}
                className={`btn ${isBookmarked ? 'btn-danger' : 'btn-outline-secondary'} py-2 fw-semibold d-flex align-items-center justify-content-center gap-2`}
              >
                <i className={`bi ${isBookmarked ? 'bi-bookmark-heart-fill' : 'bi-bookmark-heart'} fs-5`}></i>
                {isBookmarked ? 'Saved to My Schemes' : 'Bookmark / Save Scheme'}
              </button>

              <button
                onClick={onOpenEligibilityWizard}
                className="btn btn-link text-decoration-none small text-center text-muted pt-2"
              >
                Launch AI Scheme Eligibility Checker
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          show={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          scheme={scheme}
          user={user}
          onSuccess={() => {
            navigate('/dashboard');
          }}
        />
      )}
    </div>
  );
};

export default SchemeDetail;
