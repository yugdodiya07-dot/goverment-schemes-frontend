import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import schemeService from '../../services/schemeService';
import {
  INDIAN_STATES,
  OCCUPATIONS,
  CATEGORIES_LIST,
  SPECIAL_STATUS_OPTIONS,
} from '../../utils/constants';
import { getEligibilityBadgeProps } from '../../utils/eligibilityCalculator';
import Loader from '../common/Loader';

const EligibilityWizardModal = ({ show, onClose }) => {
  const [step, setStep] = useState(1); // 1: Input Profile, 2: Results
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState('eligible'); // 'eligible', 'partial', 'notEligible'

  const [profile, setProfile] = useState({
    age: 25,
    annualIncome: 300000,
    occupation: 'Farmer',
    gender: 'Male',
    state: 'Uttar Pradesh',
    category: 'General',
    disabilityStatus: false,
    specialStatus: ['Farmer'],
  });

  useEffect(() => {
    if (!show) {
      // reset step when closed
      setStep(1);
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecialStatusToggle = (val) => {
    setProfile((prev) => {
      const exists = prev.specialStatus.includes(val);
      const updated = exists
        ? prev.specialStatus.filter((item) => item !== val)
        : [...prev.specialStatus, val];
      return { ...prev, specialStatus: updated };
    });
  };

  const handleCheckEligibility = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await schemeService.checkEligibility(profile);
      if (response && response.data) {
        setResults(response.data);
        setStep(2);
      }
    } catch (error) {
      console.error('Eligibility check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const eligible100 = results.filter((s) => s.matchPercentage === 100);
  const partialMatch = results.filter((s) => s.matchPercentage >= 50 && s.matchPercentage < 100);
  const notEligible = results.filter((s) => s.matchPercentage < 50);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(6px)' }}
      role="dialog"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content glass-card border-0 rounded-4 shadow-lg">
          {/* Modal Header */}
          <div className="modal-header border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-warning text-dark fw-bold"
                style={{ width: '38px', height: '38px' }}
              >
                <i className="bi bi-magic fs-5"></i>
              </div>
              <div>
                <h5 className="modal-title brand-font fw-bold mb-0">
                  GovSmart AI Scheme Eligibility Checker
                </h5>
                <small className="text-muted">
                  Weighted 8-Factor Profile Matcher across Government of India Schemes
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            {step === 1 ? (
              <form onSubmit={handleCheckEligibility}>
                <div className="alert alert-info border-0 rounded-4 p-3 mb-4 d-flex align-items-center gap-3">
                  <i className="bi bi-info-circle-fill fs-3 text-info"></i>
                  <div>
                    <strong className="d-block">Instant Scheme Matching Engine</strong>
                    <span className="small">
                      Enter your demographic and economic details below. Our algorithm calculates match percentages using Age (20%), Income (20%), Occupation (20%), Gender (10%), State (10%), Category (10%), Disability (5%), and Special Status (5%).
                    </span>
                  </div>
                </div>

                <div className="row g-4">
                  {/* Age */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Age (Years)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={profile.age}
                      onChange={(e) => handleChange('age', Number(e.target.value))}
                      min="0"
                      max="110"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Gender</label>
                    <select
                      className="form-select"
                      value={profile.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                      <option value="All">Other / Prefer not to say</option>
                    </select>
                  </div>

                  {/* Annual Income */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Annual Family Income (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={profile.annualIncome}
                      onChange={(e) => handleChange('annualIncome', Number(e.target.value))}
                      step="5000"
                      required
                    />
                  </div>

                  {/* State */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">State / UT</label>
                    <select
                      className="form-select"
                      value={profile.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                    >
                      {INDIAN_STATES.filter((st) => st !== 'All').map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Occupation */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Occupation / Employment</label>
                    <select
                      className="form-select"
                      value={profile.occupation}
                      onChange={(e) => handleChange('occupation', e.target.value)}
                    >
                      {OCCUPATIONS.map((occ) => (
                        <option key={occ} value={occ}>
                          {occ}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Social Category</label>
                    <select
                      className="form-select"
                      value={profile.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                    >
                      {CATEGORIES_LIST.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Disability Status */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Person with Disability (PwD)?</label>
                    <select
                      className="form-select"
                      value={profile.disabilityStatus ? 'yes' : 'no'}
                      onChange={(e) => handleChange('disabilityStatus', e.target.value === 'yes')}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes (40% or more)</option>
                    </select>
                  </div>

                  {/* Special Status Checkboxes */}
                  <div className="col-12">
                    <label className="form-label fw-semibold d-block mb-2">
                      Special Eligibility Categories (Select all that apply)
                    </label>
                    <div className="d-flex flex-wrap gap-3">
                      {SPECIAL_STATUS_OPTIONS.map((opt) => (
                        <div key={opt.value} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`wizard-${opt.value}`}
                            checked={profile.specialStatus.includes(opt.value)}
                            onChange={() => handleSpecialStatusToggle(opt.value)}
                          />
                          <label className="form-check-label" htmlFor={`wizard-${opt.value}`}>
                            {opt.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gov-primary px-5" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Checking Eligibility...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search-heart me-2"></i> Check My Eligible Schemes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {/* Step 2: Results Display */}
                <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                  <div>
                    <h5 className="brand-font fw-bold mb-1">
                      Your Customized Scheme Eligibility Results
                    </h5>
                    <small className="text-muted">
                      Matched against {results.length} Central Government Welfare Schemes
                    </small>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                  >
                    <i className="bi bi-arrow-left"></i> Edit My Profile
                  </button>
                </div>

                {/* Tab Navigation with Badge Counts */}
                <ul className="nav nav-pills mb-4 gap-2">
                  <li className="nav-item">
                    <button
                      onClick={() => setActiveTab('eligible')}
                      className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'eligible' ? 'active bg-success' : 'text-main'}`}
                    >
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Eligible Schemes ({eligible100.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={() => setActiveTab('partial')}
                      className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'partial' ? 'active bg-warning text-dark' : 'text-main'}`}
                    >
                      <i className="bi bi-exclamation-circle-fill me-2"></i>
                      Partially Eligible Schemes ({partialMatch.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={() => setActiveTab('notEligible')}
                      className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'notEligible' ? 'active bg-danger' : 'text-main'}`}
                    >
                      <i className="bi bi-x-circle-fill me-2"></i>
                      Not Eligible Schemes ({notEligible.length})
                    </button>
                  </li>
                </ul>

                {/* Schemes Display */}
                <div className="row g-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {activeTab === 'eligible' &&
                    (eligible100.length === 0 ? (
                      <div className="col-12 text-center py-5">
                        <i className="bi bi-info-circle fs-2 text-muted"></i>
                        <p className="mt-2 text-muted fw-semibold">
                          No schemes matched 100% of your criteria. Check the Partially Eligible Schemes tab!
                        </p>
                      </div>
                    ) : (
                      eligible100.map((scheme) => {
                        const badge = getEligibilityBadgeProps(scheme.matchPercentage);
                        return (
                          <div key={scheme._id} className="col-md-6">
                            <div className="card glass-card border-0 p-3 h-100">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                                  {scheme.category}
                                </span>
                                <span className={badge.badgeClass}>
                                  <i className="bi bi-check-circle-fill me-1"></i> 100% Eligible
                                </span>
                              </div>

                              <h6 className="brand-font fw-bold mb-1">{scheme.title}</h6>
                              <small className="text-muted d-block mb-2">{scheme.ministry}</small>
                              <p className="small text-muted mb-2 text-truncate">{scheme.shortDescription}</p>

                              <div className="p-2 rounded-2 mb-3 bg-success-subtle text-success small fw-semibold">
                                <i className="bi bi-check-lg me-1"></i>
                                {badge.text}
                              </div>

                              <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top">
                                <span className="fw-bold text-main small">{scheme.benefitAmount}</span>
                                <Link
                                  to={`/schemes/${scheme._id}`}
                                  onClick={onClose}
                                  className="btn btn-sm btn-gov-primary px-3"
                                >
                                  Apply Now <i className="bi bi-arrow-right"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ))}

                  {activeTab === 'partial' &&
                    (partialMatch.length === 0 ? (
                      <div className="col-12 text-center py-5">
                        <i className="bi bi-info-circle fs-2 text-muted"></i>
                        <p className="mt-2 text-muted fw-semibold">
                          No partially matched schemes found.
                        </p>
                      </div>
                    ) : (
                      partialMatch.map((scheme) => {
                        const badge = getEligibilityBadgeProps(scheme.matchPercentage);
                        return (
                          <div key={scheme._id} className="col-md-6">
                            <div className="card glass-card border-0 p-3 h-100">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill">
                                  {scheme.category}
                                </span>
                                <span className={badge.badgeClass}>
                                  <i className="bi bi-exclamation-triangle-fill me-1"></i> {scheme.matchPercentage}% Match
                                </span>
                              </div>

                              <h6 className="brand-font fw-bold mb-1">{scheme.title}</h6>
                              <small className="text-muted d-block mb-2">{scheme.ministry}</small>
                              <p className="small text-muted mb-2 text-truncate">{scheme.shortDescription}</p>

                              <div className="p-2 rounded-2 mb-3 bg-warning-subtle text-dark small fw-semibold">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {badge.text}
                              </div>

                              <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top">
                                <span className="fw-bold text-main small">{scheme.benefitAmount}</span>
                                <Link
                                  to={`/schemes/${scheme._id}`}
                                  onClick={onClose}
                                  className="btn btn-sm btn-outline-secondary px-3"
                                >
                                  View Criteria <i className="bi bi-arrow-right"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ))}

                  {activeTab === 'notEligible' &&
                    (notEligible.length === 0 ? (
                      <div className="col-12 text-center py-5">
                        <i className="bi bi-info-circle fs-2 text-muted"></i>
                        <p className="mt-2 text-muted fw-semibold">
                          No schemes below 50% match.
                        </p>
                      </div>
                    ) : (
                      notEligible.map((scheme) => {
                        const badge = getEligibilityBadgeProps(scheme.matchPercentage);
                        return (
                          <div key={scheme._id} className="col-md-6">
                            <div className="card glass-card border-0 p-3 h-100 opacity-75">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">
                                  {scheme.category}
                                </span>
                                <span className={badge.badgeClass}>
                                  <i className="bi bi-x-circle-fill me-1"></i> {scheme.matchPercentage}% Match
                                </span>
                              </div>

                              <h6 className="brand-font fw-bold mb-1">{scheme.title}</h6>
                              <small className="text-muted d-block mb-2">{scheme.ministry}</small>

                              <div className="p-2 rounded-2 mb-3 bg-danger-subtle text-danger small fw-semibold">
                                <i className="bi bi-x-circle me-1"></i>
                                {badge.text}
                              </div>

                              <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top">
                                <span className="fw-bold text-muted small">{scheme.benefitAmount}</span>
                                <Link
                                  to={`/schemes/${scheme._id}`}
                                  onClick={onClose}
                                  className="btn btn-sm btn-outline-secondary px-3"
                                >
                                  View Scheme
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ))}
                </div>

                <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                  <button type="button" className="btn btn-gov-primary px-4" onClick={onClose}>
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityWizardModal;
