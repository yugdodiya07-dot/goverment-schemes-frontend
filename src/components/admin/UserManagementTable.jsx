import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import userService from '../../services/userService';
import StatusBadge from '../common/StatusBadge';
import Pagination from '../common/Pagination';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/formatters';

const UserManagementTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selected user modal state
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers({
        page: currentPage,
        limit: 15,
        search,
        status: statusFilter,
        category: categoryFilter,
      });
      setUsers(res.data);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load registered users directory.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await userService.updateUserStatus(userId, newStatus);
      toast.success(`User status updated to ${newStatus} successfully.`);
      fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleSoftDelete = async (user) => {
    const result = await Swal.fire({
      title: 'Soft-Delete Citizen Account?',
      html: `You are about to soft-delete <strong>${user.name} (${user.email})</strong>. This will set their status to <strong>'Deleted'</strong> while preserving their application history in government archives.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c0392b',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Soft-Delete Account',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await userService.deleteUser(user._id);
        toast.success('Citizen account soft-deleted. Historical records preserved.');
        fetchUsers();
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to soft delete account.');
      }
    }
  };

  const handleViewUserModal = async (userId) => {
    setModalLoading(true);
    try {
      const res = await userService.getUserById(userId);
      setSelectedUserData(res);
    } catch (error) {
      toast.error('Failed to fetch user profile details.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="card glass-card border-0 p-4">
      {/* Table Header Controls */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-transparent border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 shadow-none"
              placeholder="Search by name, email, phone, state..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="col-md-3">
          <select
            className="form-select shadow-none"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Status (Active, Blocked, Deleted)</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
            <option value="Deleted">Deleted (Soft-Deleted)</option>
          </select>
        </div>

        <div className="col-md-4 d-flex gap-2">
          <select
            className="form-select shadow-none"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Social Categories</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>

          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setSearch('');
              setStatusFilter('');
              setCategoryFilter('');
              setCurrentPage(1);
            }}
            title="Reset Filters"
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <Loader text="Loading citizens directory..." />
      ) : users.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-person-x fs-2"></i>
          <p className="mt-2 fw-semibold">No citizen accounts matched your filters.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr className="text-muted small">
                <th>Citizen Details</th>
                <th>Demographics</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th className="text-end">Officer Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="fw-bold text-main">{user.name}</div>
                    <small className="text-muted d-block">{user.email}</small>
                    <small className="text-muted">
                      <i className="bi bi-phone me-1"></i> {user.phone}
                    </small>
                  </td>
                  <td>
                    <div className="small">
                      <strong>State:</strong> {user.state}
                    </div>
                    <small className="text-muted d-block">
                      <strong>Cat:</strong> {user.category} | <strong>Occ:</strong> {user.occupation}
                    </small>
                    <small className="text-muted">
                      <strong>Income:</strong> ₹{user.annualIncome?.toLocaleString('en-IN')}
                    </small>
                  </td>
                  <td className="small">{formatDate(user.createdAt)}</td>
                  <td>
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="text-end">
                    <div className="btn-group">
                      <button
                        onClick={() => handleViewUserModal(user._id)}
                        className="btn btn-sm btn-outline-secondary"
                        title="View Full Profile & Submitted Applications"
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>

                      {user.status === 'Active' && (
                        <button
                          onClick={() => handleStatusChange(user._id, 'Blocked')}
                          className="btn btn-sm btn-outline-warning"
                          title="Block User from Login"
                        >
                          <i className="bi bi-slash-circle-fill"></i>
                        </button>
                      )}

                      {user.status === 'Blocked' && (
                        <button
                          onClick={() => handleStatusChange(user._id, 'Active')}
                          className="btn btn-sm btn-outline-success"
                          title="Unblock User"
                        >
                          <i className="bi bi-check-circle-fill"></i>
                        </button>
                      )}

                      {user.status !== 'Deleted' && (
                        <button
                          onClick={() => handleSoftDelete(user)}
                          className="btn btn-sm btn-outline-danger"
                          title="Soft-Delete User (Preserves Applications)"
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* User Profile & Applications Modal */}
      {(selectedUserData || modalLoading) && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)' }}
          role="dialog"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content glass-card border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
                <div>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill mb-1">
                    Citizen Dossier
                  </span>
                  <h5 className="modal-title brand-font fw-bold mb-0">
                    {selectedUserData?.user?.name || 'Loading Profile...'}
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setSelectedUserData(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                {modalLoading ? (
                  <Loader text="Loading citizen dossier and applications..." />
                ) : (
                  selectedUserData && (
                    <div>
                      {/* Demographic KYC Card */}
                      <div className="card glass-card border-0 p-4 mb-4">
                        <h6 className="brand-font fw-bold mb-3 border-bottom pb-2">
                          Verified Citizen Demographic Records
                        </h6>
                        <div className="row g-3 small">
                          <div className="col-md-4">
                            <strong>Full Name:</strong> {selectedUserData.user.name}
                          </div>
                          <div className="col-md-4">
                            <strong>Email:</strong> {selectedUserData.user.email}
                          </div>
                          <div className="col-md-4">
                            <strong>Phone:</strong> {selectedUserData.user.phone}
                          </div>
                          <div className="col-md-4">
                            <strong>State:</strong> {selectedUserData.user.state}
                          </div>
                          <div className="col-md-4">
                            <strong>District:</strong> {selectedUserData.user.district || 'N/A'}
                          </div>
                          <div className="col-md-4">
                            <strong>Annual Income:</strong> ₹{selectedUserData.user.annualIncome?.toLocaleString('en-IN')}
                          </div>
                          <div className="col-md-4">
                            <strong>Category:</strong> {selectedUserData.user.category}
                          </div>
                          <div className="col-md-4">
                            <strong>Occupation:</strong> {selectedUserData.user.occupation}
                          </div>
                          <div className="col-md-4">
                            <strong>Account Status:</strong> <StatusBadge status={selectedUserData.user.status} />
                          </div>
                        </div>
                      </div>

                      {/* Submitted Applications History */}
                      <h6 className="brand-font fw-bold mb-3">
                        Submitted Applications History ({selectedUserData.applications?.length || 0})
                      </h6>

                      {selectedUserData.applications?.length === 0 ? (
                        <p className="text-muted small">No applications submitted by this citizen yet.</p>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                            <thead>
                              <tr className="text-muted small">
                                <th>Scheme Title</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedUserData.applications.map((app) => (
                                <tr key={app._id}>
                                  <td>
                                    <strong>{app.scheme?.title || 'Scheme Application'}</strong>
                                  </td>
                                  <td className="small">{formatDate(app.createdAt)}</td>
                                  <td>
                                    <StatusBadge status={app.status} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              <div className="modal-footer border-top py-3 px-4">
                <button
                  type="button"
                  className="btn btn-gov-primary px-4"
                  onClick={() => setSelectedUserData(null)}
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;
