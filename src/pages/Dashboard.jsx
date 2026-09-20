import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import emblemLogo from '../assets/logo/emblem.png';
import applicationService from '../services/applicationService';
import schemeService from '../services/schemeService';
import CitizenOverview from '../components/dashboard/CitizenOverview';
import ApplicationCard from '../components/dashboard/ApplicationCard';
import SavedSchemes from '../components/dashboard/SavedSchemes';
import ProfileModal from '../components/dashboard/ProfileModal';
import Loader from '../components/common/Loader';

const Dashboard = ({ onOpenEligibilityWizard }) => {
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') || 'overview';
  const [applications, setApplications] = useState([]);
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const appsRes = await applicationService.getMyApplications();
      setApplications(appsRes.data || []);

      // If user has saved schemes array, load populated or details
      if (user && user.savedSchemes && user.savedSchemes.length > 0) {
        // Fetch saved schemes by ID or filter directory
        const allRes = await schemeService.getAllSchemes({ limit: 100 });
        const bookmarked = (allRes.data || []).filter((s) =>
          user.savedSchemes.some((item) =>
            typeof item === 'string' ? item === s._id : item._id === s._id
          )
        );
        setSavedSchemes(bookmarked);
      } else {
        setSavedSchemes([]);
      }
    } catch (error) {
      toast.error('Failed to load citizen dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleTabChange = (tabName) => {
    if (tabName === 'profile') {
      setShowProfileModal(true);
    } else {
      setSearchParams({ tab: tabName });
    }
  };

  const handleBookmarkToggle = async (schemeId) => {
    try {
      const res = await schemeService.toggleBookmark(schemeId);
      toast.success(res.message);
      if (refreshUser) await refreshUser();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update bookmark.');
    }
  };

  if (loading && applications.length === 0) {
    return <Loader fullScreen text="Loading citizen dashboard and application archives..." />;
  }

  return (
    <div className="container py-4 my-2">
      {/* Dashboard Top Navigation Pills */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <img
            src={emblemLogo}
            alt="Government of India National Emblem"
            style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                GovSmart India
              </span>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                Citizen Portal
              </span>
            </div>
            <h2 className="brand-font fw-bold mb-0">My Welfare Dashboard</h2>
          </div>
        </div>

        <ul className="nav nav-pills gap-2">
          <li className="nav-item">
            <button
              onClick={() => handleTabChange('overview')}
              className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'overview' ? 'active btn-gov-primary' : 'text-main bg-card'}`}
            >
              <i className="bi bi-speedometer2 me-2"></i> Overview
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => handleTabChange('applications')}
              className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'applications' ? 'active btn-gov-primary' : 'text-main bg-card'}`}
            >
              <i className="bi bi-folder-fill me-2"></i> My Applications ({applications.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => handleTabChange('saved')}
              className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'saved' ? 'active btn-gov-primary' : 'text-main bg-card'}`}
            >
              <i className="bi bi-bookmark-heart-fill me-2"></i> Saved Schemes ({savedSchemes.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setShowProfileModal(true)}
              className="nav-link rounded-pill px-4 fw-semibold text-main bg-card"
            >
              <i className="bi bi-person-circle me-2"></i> Edit KYC Profile
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Contents */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <CitizenOverview
            user={user}
            applications={applications}
            onOpenEligibilityWizard={onOpenEligibilityWizard}
            onTabChange={handleTabChange}
          />
        )}

        {activeTab === 'applications' && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h5 className="brand-font fw-bold mb-1">My Submitted Applications</h5>
                <small className="text-muted">
                  Click 'Track Status' on any card to view the 4-Stage Government verification timeline
                </small>
              </div>
              <button
                onClick={() => navigate('/schemes')}
                className="btn btn-gov-primary btn-sm px-3"
              >
                <i className="bi bi-plus-circle me-1"></i> Apply For New Scheme
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="card glass-card border-0 p-5 text-center my-4">
                <div className="mx-auto mb-3 text-muted">
                  <i className="bi bi-folder-x fs-1"></i>
                </div>
                <h5 className="brand-font fw-bold">No Scheme Applications Submitted Yet</h5>
                <p className="text-muted max-w-md mx-auto mb-4">
                  You have not applied for any welfare programs yet. Explore our directory or check your eligibility instantly.
                </p>
                <div>
                  <button
                    onClick={() => navigate('/schemes')}
                    className="btn btn-gov-primary px-4"
                  >
                    <i className="bi bi-folder2-open me-2"></i> Browse Scheme Directory
                  </button>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {applications.map((app) => (
                  <div key={app._id} className="col-12">
                    <ApplicationCard application={app} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <SavedSchemes
            savedSchemes={savedSchemes}
            onBookmarkToggle={handleBookmarkToggle}
            onExploreSchemes={() => navigate('/schemes')}
          />
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onProfileUpdated={() => {
            fetchDashboardData();
            if (refreshUser) refreshUser();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
