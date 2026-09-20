import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../utils/validationRules';
import emblemLogo from '../assets/logo/emblem.png';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res && res.user?.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const serverMsg = error?.response?.data?.message || 'Login failed. Please verify your credentials.';
      setErrorMessage(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-3">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
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
              <h3 className="brand-font fw-bold mb-1">GovSmart India</h3>
              <p className="text-muted small fw-semibold mb-2">
                One Portal for Every Government Scheme
              </p>
              <h6 className="brand-font fw-bold mb-1 text-dark">Citizen & Officer Sign In</h6>
              <p className="text-muted small mb-0">
                Access your portal dashboard and application tracking
              </p>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="alert alert-danger border-0 rounded-3 p-3 mb-4 d-flex align-items-center gap-2 small fw-semibold">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <label className="form-label fw-semibold mb-0">Password</label>
                  <Link to="/forgot-password" className="small text-success text-decoration-none fw-semibold">
                    Forgot Password?
                  </Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-transparent text-muted">
                    <i className="bi bi-key"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary border"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-gov-primary w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i> Sign In to GovSmart
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="text-center mt-4 pt-3 border-top small">
              <span className="text-muted">Don't have a GovSmart citizen account?</span>{' '}
              <Link to="/register" className="fw-bold text-decoration-none">
                Register Now &rarr;
              </Link>
            </div>
          </div>

          <div className="text-center mt-3 small text-muted">
            <i className="bi bi-shield-check me-1 text-success"></i>
            256-Bit Encrypted National Portal | Direct Benefit Transfer Enabled
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
