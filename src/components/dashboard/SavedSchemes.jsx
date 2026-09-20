import React from 'react';
import SchemeCard from '../schemes/SchemeCard';

const SavedSchemes = ({ savedSchemes = [], onBookmarkToggle, onExploreSchemes }) => {
  if (savedSchemes.length === 0) {
    return (
      <div className="card glass-card border-0 p-5 text-center my-4">
        <div className="mx-auto mb-3 text-muted">
          <i className="bi bi-bookmark-heart fs-1"></i>
        </div>
        <h5 className="brand-font fw-bold">No Saved Schemes Yet</h5>
        <p className="text-muted max-w-md mx-auto mb-4">
          You haven't bookmarked any schemes. Browse our national directory or use the AI Eligibility Checker to discover welfare programs matching your profile.
        </p>
        <div>
          <button onClick={onExploreSchemes} className="btn btn-gov-primary px-4">
            <i className="bi bi-folder2-open me-2"></i> Browse All Government Schemes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="brand-font fw-bold mb-1">My Bookmarked Schemes</h5>
          <small className="text-muted">
            You have saved {savedSchemes.length} schemes for quick access and application
          </small>
        </div>
      </div>

      <div className="row g-4">
        {savedSchemes.map((scheme) => (
          <div key={scheme._id} className="col-md-6 col-lg-4">
            <SchemeCard
              scheme={scheme}
              isBookmarked={true}
              onBookmarkToggle={onBookmarkToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedSchemes;
