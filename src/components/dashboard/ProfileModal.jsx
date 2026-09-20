import React, { useState } from 'react';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import {
  INDIAN_STATES,
  OCCUPATIONS,
  CATEGORIES_LIST,
  SPECIAL_STATUS_OPTIONS,
} from '../../utils/constants';

const ProfileModal = ({ user, onClose, onProfileUpdated }) => {
  const { updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || 25,
    gender: user?.gender || 'Male',
    occupation: user?.occupation || 'Farmer',
    state: user?.state || 'Uttar Pradesh',
    district: user?.district || '',
    address: user?.address || '',
    annualIncome: user?.annualIncome || 300000,
    category: user?.category || 'General',
    disabilityStatus: user?.disabilityStatus ? 'yes' : 'no',
    specialStatus: user?.specialStatus || [],
  });

  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('phone', formData.phone);
      submitData.append('age', formData.age);
      submitData.append('gender', formData.gender);
      submitData.append('occupation', formData.occupation);
      submitData.append('state', formData.state);
      submitData.append('district', formData.district);
      submitData.append('address', formData.address);
      submitData.append('annualIncome', formData.annualIncome);
      submitData.append('category', formData.category);
      submitData.append('disabilityStatus', formData.disabilityStatus === 'yes');

      formData.specialStatus.forEach((item) => {
        submitData.append('specialStatus', item);
      });

      if (profilePhoto) {
        submitData.append('profilePhoto', profilePhoto);
      }

      const res = await authService.updateProfile(submitData);
      updateUserData(res.user);
      toast.success('Your KYC demographic profile was updated successfully!');
      if (onProfileUpdated) onProfileUpdated(res.user);
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(5px)' }}
      role="dialog"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content glass-card border-0 rounded-4 shadow-lg">
          <div className="modal-header border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
            <div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill mb-1">
                Citizen KYC Records
              </span>
              <h5 className="modal-title brand-font fw-bold mb-0">
                Edit Demographic & Economic Profile
              </h5>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Full Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Mobile Phone */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">10-Digit Mobile Number *</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    maxLength="10"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Age */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Age (Years)</label>
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
                  <label className="form-label fw-semibold">Gender</label>
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
                  <label className="form-label fw-semibold">Occupation</label>
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

                {/* Category */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Social Category</label>
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
                    <option value="yes">Yes</option>
                  </select>
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

                {/* District */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">District</label>
                  <input
                    type="text"
                    name="district"
                    className="form-control"
                    placeholder="e.g. Pune, Lucknow"
                    value={formData.district}
                    onChange={handleChange}
                  />
                </div>

                {/* Full Address */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Residential Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="House No, Street, Landmark"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                {/* Special Status Checkboxes */}
                <div className="col-12">
                  <label className="form-label fw-semibold d-block mb-2">
                    Special Categories (Select all that apply)
                  </label>
                  <div className="d-flex flex-wrap gap-3">
                    {SPECIAL_STATUS_OPTIONS.map((opt) => (
                      <div key={opt.value} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`profile-${opt.value}`}
                          checked={formData.specialStatus.includes(opt.value)}
                          onChange={() => handleSpecialStatusToggle(opt.value)}
                        />
                        <label className="form-check-label" htmlFor={`profile-${opt.value}`}>
                          {opt.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile Photo Upload */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Upload Profile Photo (Optional JPG/PNG)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-gov-primary px-5" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving KYC Changes...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-2"></i> Save Profile Records
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
