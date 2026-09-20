import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import notificationService from '../../services/notificationService';
import emblemLogo from '../../assets/logo/emblem.png';

const Navbar = ({ onOpenEligibilityWizard }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      const data = res?.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      // Default offline/fallback notifications
      const defaults = [
        {
          _id: 'def-1',
          title: 'Welcome to GovSmart India',
          message: 'Explore over 120+ flagship government welfare schemes.',
          link: '/schemes',
          read: false,
          createdAt: new Date(),
        },
      ];
      setNotifications(defaults);
      setUnreadCount(1);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky-top navbar-gov">
      {/* Indian National Tricolor Top Bar */}
      <div className="national-header-strip"></div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg py-2">
        <div className="container-xl d-flex align-items-center justify-content-between">
          {/* 1. Left: Government Emblem logo + Brand & Tagline */}
          <Link className="navbar-brand d-flex align-items-center gap-3 text-decoration-none py-1 me-0" to="/">
            <img
              src={emblemLogo}
              alt="Government of India National Emblem"
              style={{ height: '46px', width: 'auto', objectFit: 'contain' }}
            />
            <div className="d-flex flex-column justify-content-center">
              <span className="navbar-brand-text lh-1 mb-1">
                GovSmart India
              </span>
              <span className="navbar-tagline-text lh-1">
                One Portal for Every Government Scheme
              </span>
            </div>
          </Link>

          {/* Mobile Toggler */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#smartSchemeNavbar"
            aria-controls="smartSchemeNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list fs-2"></i>
          </button>

          {/* 2. Center: Navigation Links (Home, Schemes, Eligibility Checker, Categories, About Us, Contact Us) */}
          <div className="collapse navbar-collapse justify-content-center" id="smartSchemeNavbar">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center gap-1">
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/" end>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/schemes">
                  Schemes
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/eligibility-checker">
                  Eligibility Checker
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/categories">
                  Categories
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/about">
                  About Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/contact">
                  Contact Us
                </NavLink>
              </li>
            </ul>

            {/* 3. Right: Search, Theme Toggle, Notifications (with badge), and User Profile dropdown */}
            <div className="d-flex align-items-center gap-2 ms-lg-auto mt-3 mt-lg-0">
              {/* Search Shortcut Button */}
              <button
                type="button"
                className="nav-action-btn"
                onClick={() => navigate('/schemes')}
                title="Search Government Schemes"
                aria-label="Search Government Schemes"
              >
                <i className="bi bi-search fs-6"></i>
              </button>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Notifications Dropdown (with badge) */}
              <div className="dropdown">
                <button
                  className="nav-action-btn"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <i className="bi bi-bell fs-6"></i>
                  {unreadCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white"
                      style={{ fontSize: '0.62rem', padding: '0.25em 0.5em' }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-0 mt-2" style={{ width: '330px', maxHeight: '400px', overflowY: 'auto' }}>
                  <li className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light rounded-top-4">
                    <strong className="small mb-0">Notifications</strong>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 text-decoration-none small"
                        onClick={markAllRead}
                      >
                        Mark all read
                      </button>
                    )}
                  </li>
                  {notifications.length === 0 ? (
                    <li className="p-4 text-center text-muted small">No notifications yet.</li>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <li key={n._id} className="border-bottom">
                        <Link
                          to={n.link || '/dashboard'}
                          className={`dropdown-item p-3 text-wrap ${!n.read ? 'bg-light-subtle fw-semibold' : ''}`}
                          style={{ fontSize: '0.85rem' }}
                        >
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="badge bg-success-subtle text-success border rounded-pill">
                              {n.type || 'System'}
                            </span>
                          </div>
                          <div className="text-dark">{n.title}</div>
                          <small className="text-muted d-block">{n.message}</small>
                        </Link>
                      </li>
                    ))
                  )}
                  <li className="p-2 text-center bg-light rounded-bottom-4">
                    <Link to="/dashboard" className="small text-decoration-none fw-semibold">
                      View All in Dashboard →
                    </Link>
                  </li>
                </ul>
              </div>

              {/* User Profile Dropdown */}
              {isAuthenticated ? (
                <div className="dropdown">
                  <button
                    className="nav-profile-btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    title="User Profile"
                  >
                    <span
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{
                        width: '26px',
                        height: '26px',
                        fontSize: '0.75rem',
                        backgroundColor: isAdmin ? '#c0392b' : '#16a34a',
                      }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <span className="text-truncate" style={{ maxWidth: '110px' }}>
                      {user?.name?.split(' ')[0] || 'Profile'}
                    </span>
                    {isAdmin && (
                      <span className="badge bg-danger text-white rounded-pill ms-1" style={{ fontSize: '0.65rem' }}>
                        Admin
                      </span>
                    )}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2 mt-2">
                    <li className="px-3 py-2 border-bottom mb-2">
                      <small className="text-muted d-block">Signed in as</small>
                      <strong className="text-truncate d-block" style={{ maxWidth: '190px' }}>
                        {user?.email}
                      </strong>
                    </li>

                    {isAdmin ? (
                      <li>
                        <Link className="dropdown-item rounded-3 py-2" to="/admin-dashboard">
                          <i className="bi bi-shield-lock-fill text-danger me-2"></i> Admin Dashboard
                        </Link>
                      </li>
                    ) : (
                      <>
                        <li>
                          <Link className="dropdown-item rounded-3 py-2" to="/dashboard">
                            <i className="bi bi-speedometer2 text-primary me-2"></i> My Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item rounded-3 py-2" to="/dashboard?tab=saved">
                            <i className="bi bi-bookmark-heart-fill text-danger me-2"></i> Saved Schemes
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item rounded-3 py-2" to="/dashboard?tab=profile">
                            <i className="bi bi-person-lines-fill text-success me-2"></i> Profile & KYC
                          </Link>
                        </li>
                      </>
                    )}

                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item rounded-3 py-2 text-danger fw-semibold"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="dropdown">
                  <button
                    className="nav-profile-btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    title="Citizen Account"
                  >
                    <span
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{ width: '26px', height: '26px', fontSize: '0.75rem', backgroundColor: '#64748b' }}
                    >
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <span>Sign In</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-3 mt-2" style={{ minWidth: '240px' }}>
                    <li className="mb-2 text-center">
                      <strong className="d-block text-main mb-1">GovSmart India</strong>
                      <small className="text-muted">Sign in to apply & track welfare schemes</small>
                    </li>
                    <li className="mt-3">
                      <Link to="/login" className="btn btn-gov-primary w-100 rounded-pill py-2 fw-semibold mb-2 d-flex align-items-center justify-content-center gap-2">
                        <i className="bi bi-box-arrow-in-right"></i> Sign In
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="btn btn-outline-secondary w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2">
                        <i className="bi bi-person-plus"></i> Citizen Registration
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
