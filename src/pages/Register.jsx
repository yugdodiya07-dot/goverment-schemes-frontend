import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import emblemLogo from '../assets/logo/emblem.png';
import {
  validateEmail,
  validatePhone,
  validatePasswordStrength,
} from '../utils/validationRules';
import {
  INDIAN_STATES,
  OCCUPATIONS,
  CATEGORIES_LIST,
  SPECIAL_STATUS_OPTIONS,
} from '../utils/constants';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: 25,
    gender: 'Male',
    state: 'Uttar Pradesh',
    district: '',
    annualIncome: 300000,
    category: 'General',
    occupation: 'Farmer',
    disabilityStatus: 'no',
    specialStatus: ['Farmer'],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSpecialStatusToggle = (val) => {
    setFormData((prev) => {
      const exists = prev.specialStatus.includes(val);
      const updated = exists
        ? prev.specialStatus.filter((item) => item !== val)
        : [...prev.specialStatus, val];
      return { ...prev, specialStatus: updated };
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your full legal name.';
    if (!validateEmail(formData.email)) return 'Please enter a valid email address.';
    if (!validatePhone(formData.phone)) {
      return 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }
    if (!validatePasswordStrength(formData.password)) {
      return 'Password must be at least 8 characters long and contain both a letter and a number.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match. Please re-check.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        age: Number(formData.age),
        gender: formData.gender,
        state: formData.state,
        district: formData.district,
        annualIncome: Number(formData.annualIncome),
        category: formData.category,
        occupation: formData.occupation,
        disabilityStatus: formData.disabilityStatus === 'yes',
        specialStatus: formData.specialStatus,
      };

      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      const serverMsg = err?.response?.data?.message || 'Registration failed. Please check your inputs.';
      setErrorMessage(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-3">
      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">
          <div className="card glass-card border-0 p-4 p-lg-5 shadow-lg">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="mb-3">
                <img
                  src={emblemLogo}
                  alt="Government of India National Emblem"
                  style={{ height: '130px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold mb-2">
                Citizen KYC Portal
              </span>
              <h3 className="brand-font fw-bold mb-1">Create Your GovSmart India Account</h3>
              <p className="text-muted small">
                One-time registration to discover and apply for Government Welfare Schemes
              </p>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="alert alert-danger border-0 rounded-3 p-3 mb-4 d-flex align-items-center gap-2 small fw-semibold">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} noValidate>
              <h6 className="brand-font fw-bold text-primary mb-3 border-bottom pb-2">
                1. Basic Account & Contact Details
              </h6>
              <div className="row g-3 mb-4">
                {/* Full Legal Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Full Legal Name (as per Aadhaar) *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* 10-Digit Phone */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">10-Digit Mobile Number *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent text-muted">+91</span>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      placeholder="9876543210"
                      maxLength="10"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* State / UT */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">State / UT *</label>
                  <select
                    name="state"
                    className="form-select"
                    value={formData.state}
                    onChange={handleChange}
                  >
                    {INDIAN_STATES.filter((st) => st !== 'All').map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Password */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Password *</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="form-control"
                      placeholder="Min 8 chars, 1 letter & 1 num"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Confirm Password *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <h6 className="brand-font fw-bold text-primary mb-3 border-bottom pb-2">
                2. Demographic & Economic Profile (For Instant AI Scheme Matching)
              </h6>
              <div className="row g-3 mb-4">
                {/* Age */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Age (Years) *</label>
                  <input
                    type="number"
                    name="age"
                    className="form-control"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="110"
                    required
                  />
                </div>

                {/* Gender */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Gender *</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Occupation */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Occupation *</label>
                  <select
                    name="occupation"
                    className="form-select"
                    value={formData.occupation}
                    onChange={handleChange}
                  >
                    {OCCUPATIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Social Category */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Social Category *</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Annual Income */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Annual Family Income (₹) *</label>
                  <input
                    type="number"
                    name="annualIncome"
                    className="form-control"
                    value={formData.annualIncome}
                    onChange={handleChange}
                    step="5000"
                    required
                  />
                </div>

                {/* Disability Status */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Person with Disability (40%+)?</label>
                  <select
                    name="disabilityStatus"
                    className="form-select"
                    value={formData.disabilityStatus}
                    onChange={handleChange}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes (40% or more)</option>
                  </select>
                </div>

                {/* Special Status Checkboxes */}
                <div className="col-12">
                  <label className="form-label fw-semibold d-block mb-2">
                    Special Eligibility Groups (Select all that apply)
                  </label>
                  <div className="d-flex flex-wrap gap-3">
                    {SPECIAL_STATUS_OPTIONS.map((opt) => (
                      <div key={opt.value} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`reg-${opt.value}`}
                          checked={formData.specialStatus.includes(opt.value)}
                          onChange={() => handleSpecialStatusToggle(opt.value)}
                        />
                        <label className="form-check-label" htmlFor={`reg-${opt.value}`}>
                          {opt.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="alert alert-secondary border-0 rounded-3 p-3 mb-4 small">
                <i className="bi bi-info-circle me-1 text-primary"></i>
                By registering, you confirm that the demographic data provided is authentic and may be used for Government scheme matching under Digital India guidelines.
              </div>

              <button
                type="submit"
                className="btn btn-gov-primary w-100 py-3 fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Citizen Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-check-fill me-2"></i> Create Citizen Account & Start Exploring
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-4 pt-3 border-top small">
              <span className="text-muted">Already have a GovSmart citizen or officer account?</span>{' '}
              <Link to="/login" className="fw-bold text-decoration-none">
                Sign In &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
