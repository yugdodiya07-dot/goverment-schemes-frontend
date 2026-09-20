import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import { validatePhone, validatePasswordStrength } from '../utils/validationRules';
import emblemLogo from '../assets/logo/emblem.png';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Verification, 2: New Password, 3: Success
  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Step 1: Verify User ID and Registered Phone Number
  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!userId.trim()) {
      const msg = 'Please enter your User ID or registered Email.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!phone.trim() || !validatePhone(phone.trim())) {
      const msg = 'Please enter a valid 10-digit registered mobile number.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword({
        userId: userId.trim(),
        phone: phone.trim(),
      });
      if (res?.resetToken) {
        setResetToken(res.resetToken);
      }
      setStep(2);
      toast.success(res?.message || 'Account verified successfully.');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Invalid User ID or registered Phone Number.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validatePasswordStrength(newPassword)) {
      const msg =
        'Password must be at least 8 characters long and contain both a letter and a number.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = 'Passwords do not match. Please re-check.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword({
        resetToken,
        userId: userId.trim(),
        phone: phone.trim(),
        newPassword,
      });
      toast.success(
        res?.message || 'Password reset successfully! You can now log in.'
      );
      setStep(3);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Failed to reset password. Invalid User ID or registered Phone Number.';
      setErrorMessage(msg);
      toast.error(msg);
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
              <h5 className="brand-font fw-bold mb-1">Forgot Password?</h5>
              <p className="text-muted small">
                {step === 1 &&
                  'Enter your User ID and registered Mobile Number to verify your account.'}
                {step === 2 &&
                  'Enter and confirm your new secure password.'}
                {step === 3 &&
                  'Your password has been reset successfully.'}
              </p>
            </div>

            {/* Error Alert Box */}
            {errorMessage && (
              <div className="alert alert-danger border-0 rounded-3 p-3 mb-4 d-flex align-items-center gap-2 small fw-semibold">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Account Verification Form */}
            {step === 1 && (
              <form onSubmit={handleVerify} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    User ID / Registered Email Address *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light border-start-0 ps-0 shadow-none"
                      placeholder="Enter your User ID or Email"
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">
                    Registered Mobile Number *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light border-start-0 ps-0 shadow-none"
                      placeholder="Enter 10-digit registered mobile number"
                      maxLength="10"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
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
                      <span>Verifying Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Proceed</span>
                      <i className="bi bi-arrow-right-circle-fill"></i>
                    </>
                  )}
                </button>

                <div className="text-center mt-3">
                  <Link to="/login" className="small text-muted text-decoration-none fw-semibold">
                    <i className="bi bi-arrow-left me-1"></i> Back to Citizen Login
                  </Link>
                </div>
              </form>
            )}

            {/* STEP 2: Set New Password Form */}
            {step === 2 && (
              <form onSubmit={handleResetPassword} noValidate>
                <div className="alert alert-success border-0 rounded-3 p-3 mb-4 small fw-semibold">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Account verified for <strong>{userId}</strong>.
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">New Password *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <i className="bi bi-key"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control bg-light border-start-0 ps-0 shadow-none"
                      placeholder="Min 8 chars, 1 letter & 1 number"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
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
                      <i className="bi bi-key-fill"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control bg-light border-start-0 ps-0 shadow-none"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
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
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <i className="bi bi-check-circle-fill"></i>
                    </>
                  )}
                </button>

                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-link small text-muted text-decoration-none fw-semibold p-0 border-0"
                    onClick={() => {
                      setStep(1);
                      setErrorMessage(null);
                    }}
                  >
                    <i className="bi bi-arrow-left me-1"></i> Back to Verification
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Success Banner */}
            {step === 3 && (
              <div className="text-center py-4">
                <div className="alert alert-success border-0 rounded-3 p-3 mb-4 small fw-semibold">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Password reset successfully for <strong>{userId}</strong>!
                </div>
                <p className="text-muted small mb-4">
                  You can now log in with your new password.
                </p>
                <Link
                  to="/login"
                  className="btn text-white rounded-pill px-4 py-2 small fw-semibold shadow-sm"
                  style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Proceed to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
