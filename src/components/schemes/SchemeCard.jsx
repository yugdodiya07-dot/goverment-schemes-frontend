import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getEligibilityBadgeProps } from '../../utils/eligibilityCalculator';
import { formatDate } from '../../utils/formatters';

const getCategoryIconAndColor = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('education')) return { icon: 'bi bi-mortarboard-fill', color: '#9333ea', bg: '#faf5ff' };
  if (cat.includes('agriculture')) return { icon: 'bi bi-tractor', color: '#16a34a', bg: '#f0fdf4' };
  if (cat.includes('women')) return { icon: 'bi bi-gender-female', color: '#e11d48', bg: '#fff1f2' };
  if (cat.includes('health')) return { icon: 'bi bi-heart-pulse-fill', color: '#dc2626', bg: '#fef2f2' };
  if (cat.includes('employment')) return { icon: 'bi bi-briefcase-fill', color: '#2563eb', bg: '#eff6ff' };
  if (cat.includes('business')) return { icon: 'bi bi-buildings-fill', color: '#d97706', bg: '#fffbeb' };
  if (cat.includes('senior')) return { icon: 'bi bi-person-heart', color: '#ca8a04', bg: '#fefce8' };
  if (cat.includes('divyang')) return { icon: 'bi bi-person-wheelchair', color: '#0d9488', bg: '#f0fdf4' };
  if (cat.includes('housing')) return { icon: 'bi bi-house-door-fill', color: '#4f46e5', bg: '#eef2ff' };
  return { icon: 'bi bi-shield-check', color: '#16a34a', bg: '#f0fdf4' };
};

const getBadgeStyle = (scheme) => {
  const title = (scheme.title || '').toLowerCase();
  if (scheme.tag === 'Popular' || title.includes('kisan') || title.includes('awas')) {
    return { label: 'Popular', bg: '#9333ea', color: '#ffffff' };
  }
  if (scheme.tag === 'Trending' || title.includes('mudra') || title.includes('ayushman')) {
    return { label: 'Trending', bg: '#2563eb', color: '#ffffff' };
  }
  return { label: 'New', bg: '#16a34a', color: '#ffffff' };
};

const SchemeCard = ({
  scheme,
  onBookmarkToggle,
  isBookmarked = false,
  matchPercentage = null,
  viewMode = 'grid',
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const badgeProps = matchPercentage !== null ? getEligibilityBadgeProps(matchPercentage) : null;
  const { icon, color, bg } = getCategoryIconAndColor(scheme.category);
  const topBadge = getBadgeStyle(scheme);

  if (viewMode === 'list') {
    return (
      <div
        className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white scheme-card-hover"
        style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
      >
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-start gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1"
              style={{ width: '48px', height: '48px', backgroundColor: bg, color: color, fontSize: '1.4rem' }}
            >
              <i className={icon}></i>
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span
                  className="badge rounded-pill fw-semibold px-2 py-1"
                  style={{ backgroundColor: topBadge.bg, color: topBadge.color, fontSize: '0.7rem' }}
                >
                  {topBadge.label}
                </span>
                {badgeProps && (
                  <span className={`${badgeProps.badgeClass} small`}>
                    <i className="bi bi-patch-check-fill"></i> {badgeProps.label}
                  </span>
                )}
              </div>
              <h5 className="brand-font fw-bold mb-1">
                <Link to={`/schemes/${scheme._id}`} className="text-dark text-decoration-none">
                  {scheme.title}
                </Link>
              </h5>
              <span className="fw-semibold small d-block mb-2" style={{ color: '#16a34a' }}>
                {scheme.category}
              </span>
              <p className="text-muted small mb-0" style={{ maxWidth: '640px' }}>
                {scheme.description?.slice(0, 130)}...
              </p>
            </div>
          </div>

          <div className="d-flex flex-row flex-md-column align-items-center align-items-md-end justify-content-between gap-2 border-top border-md-0 pt-2 pt-md-0 mt-2 mt-md-0">
            <div className="d-flex align-items-center gap-2">
              {isAuthenticated && onBookmarkToggle && (
                <button
                  onClick={() => onBookmarkToggle(scheme._id)}
                  className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '36px', height: '36px' }}
                  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Scheme'}
                >
                  <i
                    className={`bi ${
                      isBookmarked ? 'bi-bookmark-heart-fill text-danger' : 'bi-bookmark-heart'
                    } fs-5`}
                  ></i>
                </button>
              )}
            </div>
            <div className="d-flex align-items-center gap-2">
              <small className="text-muted small">
                <i className="bi bi-calendar-event me-1"></i>
                Last Date: {scheme.applicationDeadline ? formatDate(scheme.applicationDeadline) : '31 Dec 2025'}
              </small>
              <button
                onClick={() => navigate(`/schemes/${scheme._id}`)}
                className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: '32px', height: '32px', backgroundColor: '#16a34a', border: 'none' }}
                title="View Scheme Details"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Card (Image 2 style)
  return (
    <div
      className="card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-column justify-content-between bg-white scheme-card-hover"
      style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
    >
      <div>
        {/* Top Header Row with Badge & Bookmark */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span
            className="badge rounded-pill fw-semibold px-3 py-1"
            style={{ backgroundColor: topBadge.bg, color: topBadge.color, fontSize: '0.75rem' }}
          >
            {topBadge.label}
          </span>

          <div className="d-flex align-items-center gap-2">
            {badgeProps && (
              <span className={`${badgeProps.badgeClass} small`} title={badgeProps.text}>
                <i className="bi bi-patch-check-fill"></i> {badgeProps.label}
              </span>
            )}
            {isAuthenticated && onBookmarkToggle && (
              <button
                onClick={() => onBookmarkToggle(scheme._id)}
                className="btn btn-sm btn-light border rounded-circle d-flex align-items-center justify-content-center p-0"
                style={{ width: '34px', height: '34px' }}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Scheme'}
              >
                <i
                  className={`bi ${
                    isBookmarked ? 'bi-bookmark-heart-fill text-danger' : 'bi-bookmark-heart'
                  } fs-5`}
                ></i>
              </button>
            )}
          </div>
        </div>

        {/* Scheme Icon, Title, and Category */}
        <div className="d-flex align-items-start gap-3 mb-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1"
            style={{
              width: '46px',
              height: '46px',
              backgroundColor: bg,
              color: color,
              fontSize: '1.4rem',
            }}
          >
            <i className={icon}></i>
          </div>
          <div>
            <h5 className="brand-font fw-bold mb-1">
              <Link
                to={`/schemes/${scheme._id}`}
                className="text-dark text-decoration-none hover-text-success"
              >
                {scheme.title}
              </Link>
            </h5>
            <span
              className="fw-semibold small d-inline-block mb-1"
              style={{ color: '#16a34a', fontSize: '0.85rem' }}
            >
              {scheme.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-muted small mb-4"
          style={{
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {scheme.description || 'Government assistance and welfare benefits for eligible citizens.'}
        </p>
      </div>

      {/* Bottom Border Footer with Last Date & Arrow */}
      <div
        className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto"
        style={{ borderColor: '#f3f4f6' }}
      >
        <span className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
          <i className="bi bi-calendar-event"></i>
          Last Date:{' '}
          {scheme.applicationDeadline ? formatDate(scheme.applicationDeadline) : '31 Dec 2025'}
        </span>
        <button
          type="button"
          onClick={() => navigate(`/schemes/${scheme._id}`)}
          className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-white"
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#ffffff',
            color: '#4b5563',
            border: '1px solid #e5e7eb',
          }}
          title="View Scheme Details"
        >
          <i className="bi bi-chevron-right text-dark"></i>
        </button>
      </div>
    </div>
  );
};

export default SchemeCard;
