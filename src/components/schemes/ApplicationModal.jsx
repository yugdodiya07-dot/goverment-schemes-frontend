import React, { useState } from 'react';
import { toast } from 'react-toastify';
import applicationService from '../../services/applicationService';
import { validatePhone, validateAadhaar, validateFile } from '../../utils/validationRules';
import { INDIAN_STATES } from '../../utils/constants';

const ApplicationModal = ({ show, onClose, scheme, user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    aadharNumber: '',
    state: user?.state || 'New Delhi',
    district: user?.district || '',
    address: user?.address || '',
    occupation: user?.occupation || 'Farmer',
    annualIncome: user?.annualIncome || 300000,
    category: user?.category || 'General',
    remarks: 'Applying for benefits under digital welfare guidelines.',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});

  if (!show || !scheme) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    for (const file of files) {
      const check = validateFile(file);
      if (!check.valid) {
        toast.error(`${file.name}: ${check.error}`);
        return;
      }
      validFiles.push(file);
    }
    setSelectedFiles(validFiles);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.applicantName.trim()) newErrors.applicantName = 'Full Name is required.';
    if (!formData.phone || !validatePhone(formData.phone)) {
      newErrors.phone = 'Please provide a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }
    if (!formData.aadharNumber || !validateAadhaar(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhaar Number must be exactly 12 numeric digits.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please correct the highlighted form errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('schemeId', scheme._id);
      submitData.append('applicantName', formData.applicantName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('aadharNumber', formData.aadharNumber);
      submitData.append('state', formData.state);
      submitData.append('district', formData.district);
      submitData.append('address', formData.address);
      submitData.append('occupation', formData.occupation);
      submitData.append('annualIncome', formData.annualIncome);
      submitData.append('category', formData.category);
      submitData.append('remarks', formData.remarks);

      selectedFiles.forEach((file) => {
        submitData.append('documents', file);
      });

      const response = await applicationService.submitApplication(submitData);

      toast.success('Scheme Application Submitted Successfully!');
      onSuccess(response.data);
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to submit application.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(6px)' }}
      role="dialog"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content glass-card border-0 rounded-4 shadow-lg">
          {/* Modal Header */}
          <div className="modal-header border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
            <div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill mb-1">
                {scheme.code}
              </span>
              <h5 className="modal-title brand-font fw-bold mb-0">
                Apply for {scheme.title}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            <div className="alert alert-warning border-0 rounded-4 p-3 mb-4 d-flex align-items-center gap-3">
              <i className="bi bi-shield-lock-fill fs-3 text-warning"></i>
              <div>
                <strong className="d-block">Government KYC Authentication Notice</strong>
                <span className="small">
                  Ensure your 12-digit Aadhaar Number and mobile number match your government records. False declarations are punishable under the Information Technology Act.
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Applicant Full Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Applicant Full Name *</label>
                  <input
                    type="text"
                    name="applicantName"
                    className={`form-control ${errors.applicantName ? 'is-invalid' : ''}`}
                    value={formData.applicantName}
                    onChange={handleChange}
                    required
                  />
                  {errors.applicantName && (
                    <div className="invalid-feedback fw-semibold">{errors.applicantName}</div>
                  )}
                </div>

                {/* Email Address */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">10-Digit Mobile Number (Aadhaar Linked) *</label>
                  <input
                    type="text"
                    name="phone"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="9876543210"
                    maxLength="10"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && (
                    <div className="invalid-feedback fw-semibold">{errors.phone}</div>
                  )}
                </div>

                {/* 12-Digit Aadhaar Number */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">12-Digit Aadhaar Number *</label>
                  <input
                    type="text"
                    name="aadharNumber"
                    className={`form-control ${errors.aadharNumber ? 'is-invalid' : ''}`}
                    placeholder="xxxx xxxx xxxx"
                    maxLength="12"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    required
                  />
                  {errors.aadharNumber && (
                    <div className="invalid-feedback fw-semibold">{errors.aadharNumber}</div>
                  )}
                </div>

                {/* State / UT */}
                <div className="col-md-4">
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
                <div className="col-md-4">
                  <label className="form-label fw-semibold">District</label>
                  <input
                    type="text"
                    name="district"
                    className="form-control"
                    placeholder="e.g. Varanasi / Pune"
                    value={formData.district}
                    onChange={handleChange}
                  />
                </div>

                {/* Annual Income */}
                <div className="col-md-4">
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

                {/* Residential Address */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Residential Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="House No, Village/Town, P.O., Tehsil"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                {/* Required Document Uploads */}
                <div className="col-12">
                  <label className="form-label fw-semibold d-block">
                    Upload Supporting Documents (PDF, JPG, PNG under 5MB)
                  </label>
                  <small className="text-muted d-block mb-2">
                    Required for {scheme.title}: <strong>{scheme.requiredDocuments.join(', ')}</strong>
                  </small>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      {selectedFiles.map((f, i) => (
                        <span
                          key={i}
                          className="badge bg-secondary-subtle text-main border rounded-pill px-3 py-2"
                        >
                          <i className="bi bi-file-earmark-check-fill text-success me-1"></i> {f.name} ({(f.size / 1024).toFixed(0)} KB)
                        </span>
                      ))}
                    </div>
                  )}
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
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-check-fill me-2"></i> Submit Official Application
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

export default ApplicationModal;
