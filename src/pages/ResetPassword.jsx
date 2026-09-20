import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import emblemLogo from '../assets/logo/emblem.png';
import { validatePasswordStrength } from '../utils/validationRules';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordStrength(password)) {
      toast.error('Password must be at least 8 characters and contain a letter and a number.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please re-check.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword(token, password);
      toast.success(res?.message || 'Password reset successful! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Failed to reset password. The reset token may have expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card glass-card border-0 p-4 p-lg-5 shadow-lg rounded-4">
            <div className="text-center mb-4">
              <div className="mb-3">
                <img
                  src={emblemLogo}
                  alt="Government of India National Emblem"
                  style={{ height: '130px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <h4 className="brand-font fw-bold mb-1">GovSmart India</h4>
              <p className="text-muted small fw-semibold mb-3">
                One Portal for Every Government Scheme
              </p>
              <h5 className="brand-font fw-bold mb-1">Set New Password</h5>
              <p className="text-muted small">
                Please enter and confirm your new secure password for GovSmart India.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold small">New Password *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control bg-light border-start-0 ps-0 shadow-none"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-light border"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Confirm New Password *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control bg-light border-start-0 ps-0 shadow-none"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn w-100 py-2 rounded-3 text-white fw-semibold shadow-sm mb-3 d-flex align-items-center justify-content-center gap-2"
                style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    <span>Update Password</span>
                    <i className="bi bi-check-circle-fill"></i>
                  </>
                )}
              </button>

              <div className="text-center mt-3">
                <Link to="/login" className="small text-muted text-decoration-none fw-semibold">
                  <i className="bi bi-arrow-left me-1"></i> Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
