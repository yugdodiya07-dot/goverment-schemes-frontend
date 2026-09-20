import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import statsService from '../services/statsService';
import emblemLogo from '../assets/logo/emblem.png';
import schemeService from '../services/schemeService';
import applicationService from '../services/applicationService';
import contactService from '../services/contactService';
import AdminOverview from '../components/admin/AdminOverview';
import SchemeFormModal from '../components/admin/SchemeFormModal';
import UserManagementTable from '../components/admin/UserManagementTable';
import ApplicationReviewModal from '../components/admin/ApplicationReviewModal';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import { formatDate } from '../utils/formatters';
import { SCHEME_CATEGORIES } from '../utils/constants';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [statsData, setStatsData] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination and filtering for schemes tab
  const [schemeSearch, setSchemeSearch] = useState('');
  const [schemeCategory, setSchemeCategory] = useState('');

  // Pagination and filtering for applications tab
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('');
  const [appPage, setAppPage] = useState(1);
  const [appTotalPages, setAppTotalPages] = useState(1);

  // Modals state
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [reviewingApplication, setReviewingApplication] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await statsService.getAdminStats();
      setStatsData(res);
    } catch (error) {
      console.error('Stats load error:', error);
    }
  }, []);

  const fetchSchemes = useCallback(async () => {
    try {
      const res = await schemeService.getAllSchemes({
        limit: 100,
        search: schemeSearch,
        category: schemeCategory,
      });
      setSchemes(res.data || []);
    } catch (error) {
      toast.error('Failed to load schemes.');
    }
  }, [schemeSearch, schemeCategory]);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await applicationService.getAllApplications({
        page: appPage,
        limit: 15,
        search: appSearch,
        status: appStatusFilter,
      });
      setApplications(res.data || []);
      setAppTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load applications.');
    }
  }, [appPage, appSearch, appStatusFilter]);

  const fetchContactMessages = useCallback(async () => {
    try {
      const res = await contactService.getAllMessages();
      setContactMessages(res.data || []);
    } catch (error) {
      console.error('Failed to load contact messages:', error);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchSchemes(), fetchApplications(), fetchContactMessages()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchStats, fetchSchemes, fetchApplications, fetchContactMessages]);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const handleOpenNewSchemeModal = () => {
    setEditingScheme(null);
    setShowSchemeModal(true);
  };

  const handleOpenEditSchemeModal = (scheme) => {
    setEditingScheme(scheme);
    setShowSchemeModal(true);
  };

  const handleDeleteScheme = async (scheme) => {
    const res = await Swal.fire({
      title: 'Delete Government Scheme?',
      html: `Are you sure you want to delete <strong>${scheme.title}</strong>? This action will remove it from the citizen directory.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c0392b',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete Scheme',
    });

    if (res.isConfirmed) {
      try {
        await schemeService.deleteScheme(scheme._id);
        toast.success('Scheme deleted successfully.');
        fetchSchemes();
        fetchStats();
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to delete scheme.');
      }
    }
  };

  if (loading && !statsData) {
    return <Loader fullScreen text="Initializing Officer Administration Command Center..." />;
  }

  return (
    <div className="container py-4 my-2">
      {/* Officer Command Header & Navigation Tabs */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <img
            src={emblemLogo}
            alt="Government of India National Emblem"
            style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger text-white rounded-pill px-3 py-1 fw-bold">
                <i className="bi bi-shield-lock-fill me-1"></i> Officer Administration Portal
              </span>
              <span className="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill">
                GovSmart India
              </span>
            </div>
            <h2 className="brand-font fw-bold mb-0">National Command Dashboard</h2>
          </div>
        </div>

        <ul className="nav nav-pills gap-2">
          <li className="nav-item">
            <button
              onClick={() => handleTabChange('overview')}
              className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'overview' ? 'active bg-danger text-white' : 'text-main bg-card'}`}
            >
              <i className="bi bi-speedometer2 me-2"></i> Overview
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => handleTabChange('schemes')}
              className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'schemes' ? 'active bg-danger text-white' : 'text-main bg-card'}`}
            >
              <i className="bi bi-folder2-open me-2"></i> Scheme Management ({schemes.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => handleTabChange('users')}
              className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'users' ? 'active bg-danger text-white' : 'text-main bg-card'}`}
            >
              <i className="bi bi-people-fill me-2"></i> Citizen Directory
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => handleTabChange('applications')}
              className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'applications' ? 'active bg-danger text-white' : 'text-main bg-card'}`}
            >
              <i className="bi bi-clipboard-check-fill me-2"></i> Review Applications ({statsData?.stats?.pendingApplications || 0})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => handleTabChange('messages')}
              className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'messages' ? 'active bg-danger text-white' : 'text-main bg-card'}`}
            >
              <i className="bi bi-envelope-fill me-2"></i> Contact Messages ({contactMessages.length})
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Contents */}
      <div className="tab-content">
        {/* 1. Overview Tab */}
        {activeTab === 'overview' && (
          <AdminOverview statsData={statsData} onTabChange={handleTabChange} />
        )}

        {/* 2. Scheme Management Tab (Requirement #2 & #5) */}
        {activeTab === 'schemes' && (
          <div className="card glass-card border-0 p-4">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
              <div>
                <h5 className="brand-font fw-bold mb-1">Government Schemes CRUD Management</h5>
                <small className="text-muted">
                  Create, edit, or remove national welfare programs without modifying source code
                </small>
              </div>

              <button
                onClick={handleOpenNewSchemeModal}
                className="btn btn-gov-primary px-4 py-2 fw-bold d-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-circle-fill fs-5"></i> Add New Government Scheme
              </button>
            </div>

            {/* Filter bar */}
            <div className="row g-3 align-items-center mb-4">
              <div className="col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 shadow-none"
                    placeholder="Search schemes by title, code, ministry..."
                    value={schemeSearch}
                    onChange={(e) => setSchemeSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <select
                  className="form-select shadow-none"
                  value={schemeCategory}
                  onChange={(e) => setSchemeCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {SCHEME_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <button
                  onClick={() => {
                    setSchemeSearch('');
                    setSchemeCategory('');
                  }}
                  className="btn btn-outline-secondary w-100"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Schemes Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="text-muted small">
                    <th>Scheme Title & Code</th>
                    <th>Ministry</th>
                    <th>Category</th>
                    <th>Benefit Summary</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schemes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No schemes found matching your search.
                      </td>
                    </tr>
                  ) : (
                    schemes.map((s) => (
                      <tr key={s._id}>
                        <td>
                          <span className="badge bg-secondary-subtle text-muted rounded-pill mb-1">
                            {s.code}
                          </span>
                          <div className="fw-bold text-main">{s.title}</div>
                        </td>
                        <td className="small">{s.ministry}</td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary rounded-pill">
                            {s.category}
                          </span>
                        </td>
                        <td className="small fw-semibold text-main">{s.benefitAmount}</td>
                        <td>
                          <span
                            className={`badge ${s.isActive ? 'bg-success' : 'bg-secondary'} rounded-pill`}
                          >
                            {s.isActive ? 'Active' : 'Draft / Off'}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="btn-group">
                            <button
                              onClick={() => handleOpenEditSchemeModal(s)}
                              className="btn btn-sm btn-outline-secondary"
                              title="Edit Scheme Criteria without coding"
                            >
                              <i className="bi bi-pencil-square"></i> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteScheme(s)}
                              className="btn btn-sm btn-outline-danger"
                              title="Delete Scheme"
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. User Management Tab (Requirement #8) */}
        {activeTab === 'users' && <UserManagementTable />}

        {/* 4. Application Verification Tab (Requirement #15) */}
        {activeTab === 'applications' && (
          <div className="card glass-card border-0 p-4">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
              <div>
                <h5 className="brand-font fw-bold mb-1">
                  Citizen Application Verification & 4-Stage Tracking
                </h5>
                <small className="text-muted">
                  Inspect KYC records, verify uploaded attachments, and update status with remarks
                </small>
              </div>
            </div>

            {/* Application Filters */}
            <div className="row g-3 align-items-center mb-4">
              <div className="col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 shadow-none"
                    placeholder="Search applicant name, email, phone..."
                    value={appSearch}
                    onChange={(e) => {
                      setAppSearch(e.target.value);
                      setAppPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <select
                  className="form-select shadow-none"
                  value={appStatusFilter}
                  onChange={(e) => {
                    setAppStatusFilter(e.target.value);
                    setAppPage(1);
                  }}
                >
                  <option value="">All Verification Stages</option>
                  <option value="Submitted">1. Submitted (Initial)</option>
                  <option value="Under Verification">2. Under Verification</option>
                  <option value="Document Verified">3. Document Verified</option>
                  <option value="Approved">4. Approved (Disbursed)</option>
                  <option value="Rejected">5. Rejected</option>
                </select>
              </div>

              <div className="col-md-3">
                <button
                  onClick={() => {
                    setAppSearch('');
                    setAppStatusFilter('');
                    setAppPage(1);
                  }}
                  className="btn btn-outline-secondary w-100"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="text-muted small">
                    <th>Application Details</th>
                    <th>Applicant Demographics</th>
                    <th>Uploaded Docs</th>
                    <th>Submission Date</th>
                    <th>4-Stage Status</th>
                    <th className="text-end">Verification Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        No applications found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <span className="badge bg-secondary-subtle text-muted rounded-pill mb-1">
                            #{app._id.slice(-6).toUpperCase()}
                          </span>
                          <div className="fw-bold text-main">{app.scheme?.title}</div>
                          <small className="text-muted">{app.scheme?.code}</small>
                        </td>
                        <td>
                          <div className="fw-bold">{app.applicantName}</div>
                          <small className="text-muted d-block">
                            <i className="bi bi-phone me-1"></i> {app.phone}
                          </small>
                          <small className="text-muted">
                            {app.state} | {app.category}
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill">
                            <i className="bi bi-paperclip me-1"></i> {app.documents?.length || 0} Files
                          </span>
                        </td>
                        <td className="small">{formatDate(app.createdAt)}</td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => setReviewingApplication(app)}
                            className="btn btn-sm btn-gov-primary px-3 py-2 fw-bold"
                          >
                            <i className="bi bi-clipboard-check me-1"></i> Review & Update
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={appPage}
              totalPages={appTotalPages}
              onPageChange={(p) => setAppPage(p)}
            />
          </div>
        )}

        {/* 5. Contact Messages Tab */}
        {activeTab === 'messages' && (
          <div className="card glass-card border-0 p-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h5 className="brand-font fw-bold mb-1">Citizen Contact & Inquiry Messages</h5>
                <small className="text-muted">
                  Review inquiries, grievance messages, and helpline requests submitted by citizens
                </small>
              </div>
              <button
                onClick={fetchContactMessages}
                className="btn btn-outline-secondary btn-sm px-3 rounded-pill fw-semibold"
              >
                <i className="bi bi-arrow-clockwise me-1"></i> Refresh Messages
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Subject</th>
                    <th>Citizen Name</th>
                    <th>Email Address</th>
                    <th>Message Details</th>
                    <th>Received On</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessages.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                        No contact inquiries have been submitted yet.
                      </td>
                    </tr>
                  ) : (
                    contactMessages.map((msg) => (
                      <tr key={msg._id}>
                        <td>
                          <strong className="text-dark d-block">{msg.subject}</strong>
                          <span className="badge bg-success-subtle text-success rounded-pill small">
                            Inquiry
                          </span>
                        </td>
                        <td className="fw-semibold text-main">{msg.fullName || msg.name || 'Citizen'}</td>
                        <td>
                          <a href={`mailto:${msg.email}`} className="text-decoration-none text-primary">
                            {msg.email}
                          </a>
                        </td>
                        <td>
                          <p className="small text-muted mb-0" style={{ maxWidth: '350px' }}>
                            {msg.message}
                          </p>
                        </td>
                        <td className="small text-muted">{formatDate(msg.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Scheme Create/Edit Modal */}
      {showSchemeModal && (
        <SchemeFormModal
          show={showSchemeModal}
          onClose={() => setShowSchemeModal(false)}
          existingScheme={editingScheme}
          onSuccess={() => {
            fetchSchemes();
            fetchStats();
          }}
        />
      )}

      {/* Application Verification Review Modal */}
      {reviewingApplication && (
        <ApplicationReviewModal
          show={!!reviewingApplication}
          onClose={() => setReviewingApplication(null)}
          application={reviewingApplication}
          onSuccess={() => {
            fetchApplications();
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
