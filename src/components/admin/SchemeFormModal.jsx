import React, { useState } from 'react';
import { toast } from 'react-toastify';
import schemeService from '../../services/schemeService';
import {
  SCHEME_CATEGORIES,
  BENEFIT_TYPES,
  INDIAN_STATES,
  OCCUPATIONS,
  CATEGORIES_LIST,
  SPECIAL_STATUS_OPTIONS,
} from '../../utils/constants';

const SchemeFormModal = ({ show, onClose, existingScheme = null, onSuccess }) => {
  const isEditing = !!existingScheme;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: existingScheme?.title || '',
    code: existingScheme?.code || 'GOV-NEW-01',
    ministry: existingScheme?.ministry || '',
    shortDescription: existingScheme?.shortDescription || '',
    detailedDescription: existingScheme?.detailedDescription || '',
    category: existingScheme?.category || 'Agriculture & Rural',
    benefitAmount: existingScheme?.benefitAmount || '',
    benefitType: existingScheme?.benefitType || 'Financial Assistance',
    eligibleStates: existingScheme?.eligibleStates || ['All'],
    gender: existingScheme?.gender || 'All',
    minAge: existingScheme?.minAge !== undefined ? existingScheme.minAge : 18,
    maxAge: existingScheme?.maxAge !== undefined ? existingScheme.maxAge : 65,
    maxIncome: existingScheme?.maxIncome !== undefined ? existingScheme.maxIncome : 500000,
    eligibleOccupations: existingScheme?.eligibleOccupations || ['All'],
    eligibleCategories: existingScheme?.eligibleCategories || ['All'],
    requiredDisability: existingScheme?.requiredDisability || false,
    requiredSpecialStatus: existingScheme?.requiredSpecialStatus || [],
    requiredDocuments: existingScheme?.requiredDocuments || ['Aadhaar Card', 'Bank Passbook', 'Income Certificate'],
    officialWebsite: existingScheme?.officialWebsite || 'https://www.india.gov.in',
    applicationDeadline: existingScheme?.applicationDeadline
      ? existingScheme.applicationDeadline.split('T')[0]
      : '',
    isActive: existingScheme?.isActive !== undefined ? existingScheme.isActive : true,
  });

  const [docInput, setDocInput] = useState('');

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleArrayToggle = (field, val) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      if (val === 'All') {
        return { ...prev, [field]: ['All'] };
      }
      let updated = current.filter((item) => item !== 'All');
      const exists = updated.includes(val);
      if (exists) {
        updated = updated.filter((item) => item !== val);
        if (updated.length === 0) updated = ['All'];
      } else {
        updated = [...updated, val];
      }
      return { ...prev, [field]: updated };
    });
  };

  const handleAddDoc = () => {
    if (docInput.trim() && !formData.requiredDocuments.includes(docInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        requiredDocuments: [...prev.requiredDocuments, docInput.trim()],
      }));
      setDocInput('');
    }
  };

  const handleRemoveDoc = (doc) => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((d) => d !== doc),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        minAge: Number(formData.minAge),
        maxAge: Number(formData.maxAge),
        maxIncome: Number(formData.maxIncome),
      };

      if (isEditing) {
        await schemeService.updateScheme(existingScheme._id, payload);
        toast.success('Government scheme criteria updated successfully!');
      } else {
        await schemeService.createScheme(payload);
        toast.success('New Government scheme added to portal directory!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to save scheme.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(6px)' }}
      role="dialog"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content glass-card border-0 rounded-4 shadow-lg">
          <div className="modal-header border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
            <div>
              <span className="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill mb-1">
                {isEditing ? 'Officer Scheme Update' : 'New Scheme Entry'}
              </span>
              <h5 className="modal-title brand-font fw-bold mb-0">
                {isEditing ? `Edit Scheme: ${existingScheme.title}` : 'Create New Government Scheme'}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Scheme Title */}
                <div className="col-md-8">
                  <label className="form-label fw-semibold">Scheme Full Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Scheme Code */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Official Scheme Code *</label>
                  <input
                    type="text"
                    name="code"
                    className="form-control"
                    placeholder="e.g. GOV-AGRI-01"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Ministry */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Government Ministry / Department *</label>
                  <input
                    type="text"
                    name="ministry"
                    className="form-control"
                    placeholder="e.g. Ministry of Agriculture & Farmers Welfare"
                    value={formData.ministry}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Portal Category *</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {SCHEME_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Benefit Type */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Benefit Type *</label>
                  <select
                    name="benefitType"
                    className="form-select"
                    value={formData.benefitType}
                    onChange={handleChange}
                  >
                    {BENEFIT_TYPES.filter((b) => b !== 'All').map((ben) => (
                      <option key={ben} value={ben}>
                        {ben}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Benefit Amount */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Benefit Summary / Amount *</label>
                  <input
                    type="text"
                    name="benefitAmount"
                    className="form-control"
                    placeholder="e.g. ₹6,000 per year / Free 100% Health Cover"
                    value={formData.benefitAmount}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Official Website */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Official Gov.IN URL *</label>
                  <input
                    type="url"
                    name="officialWebsite"
                    className="form-control"
                    placeholder="https://www.pmkisan.gov.in"
                    value={formData.officialWebsite}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Short Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Short Summary (displayed on Card) *</label>
                  <textarea
                    name="shortDescription"
                    className="form-control"
                    rows="2"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Detailed Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Detailed Objectives & Scope *</label>
                  <textarea
                    name="detailedDescription"
                    className="form-control"
                    rows="3"
                    value={formData.detailedDescription}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="col-12 my-2">
                  <hr />
                  <h6 className="brand-font fw-bold text-warning">
                    Eligibility & Demographic Weightage Criteria
                  </h6>
                </div>

                {/* Min / Max Age */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Min Age</label>
                  <input
                    type="number"
                    name="minAge"
                    className="form-control"
                    value={formData.minAge}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Max Age</label>
                  <input
                    type="number"
                    name="maxAge"
                    className="form-control"
                    value={formData.maxAge}
                    onChange={handleChange}
                  />
                </div>

                {/* Max Income */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Max Annual Family Income (₹)</label>
                  <input
                    type="number"
                    name="maxIncome"
                    className="form-control"
                    value={formData.maxIncome}
                    onChange={handleChange}
                  />
                </div>

                {/* Gender */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Gender Criteria</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="All">All Genders</option>
                    <option value="Male">Male Only</option>
                    <option value="Female">Female Only</option>
                    <option value="Transgender">Transgender Only</option>
                  </select>
                </div>

                {/* Eligible States Toggle Checkboxes */}
                <div className="col-12">
                  <label className="form-label fw-semibold d-block mb-1">
                    Eligible States / UTs (Select 'All' for Central PAN-India scheme)
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm ${formData.eligibleStates.includes('All') ? 'btn-gov-primary' : 'btn-outline-secondary'}`}
                      onClick={() => handleArrayToggle('eligibleStates', 'All')}
                    >
                      PAN India (All States)
                    </button>
                    {INDIAN_STATES.filter((s) => s !== 'All').map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={`btn btn-sm ${formData.eligibleStates.includes(st) ? 'btn-gov-primary' : 'btn-outline-secondary'}`}
                        onClick={() => handleArrayToggle('eligibleStates', st)}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eligible Occupations */}
                <div className="col-12">
                  <label className="form-label fw-semibold d-block mb-1">
                    Target Occupations (Select 'All' for universal eligibility)
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm ${formData.eligibleOccupations.includes('All') ? 'btn-gov-primary' : 'btn-outline-secondary'}`}
                      onClick={() => handleArrayToggle('eligibleOccupations', 'All')}
                    >
                      All Occupations
                    </button>
                    {OCCUPATIONS.map((occ) => (
                      <button
                        key={occ}
                        type="button"
                        className={`btn btn-sm ${formData.eligibleOccupations.includes(occ) ? 'btn-gov-primary' : 'btn-outline-secondary'}`}
                        onClick={() => handleArrayToggle('eligibleOccupations', occ)}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Social Categories */}
                <div className="col-12">
                  <label className="form-label fw-semibold d-block mb-1">
                    Social Categories
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm ${formData.eligibleCategories.includes('All') ? 'btn-gov-primary' : 'btn-outline-secondary'}`}
                      onClick={() => handleArrayToggle('eligibleCategories', 'All')}
                    >
                      All Categories (General / SC / ST / OBC / EWS)
                    </button>
                    {CATEGORIES_LIST.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`btn btn-sm ${formData.eligibleCategories.includes(cat) ? 'btn-gov-primary' : 'btn-outline-secondary'}`}
                        onClick={() => handleArrayToggle('eligibleCategories', cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Required Documents Tag Manager */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Required Verification Documents</label>
                  <div className="input-group mb-2" style={{ maxWidth: '400px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add required document..."
                      value={docInput}
                      onChange={(e) => setDocInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleAddDoc}
                    >
                      Add Document
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.requiredDocuments.map((doc, idx) => (
                      <span
                        key={idx}
                        className="badge bg-secondary-subtle text-main border rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                      >
                        {doc}
                        <i
                          className="bi bi-x-circle-fill text-danger cursor-pointer"
                          onClick={() => handleRemoveDoc(doc)}
                        ></i>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Application Deadline & IsActive */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Application Deadline Date</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    className="form-control"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 d-flex align-items-end">
                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="schemeActiveToggle"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="schemeActiveToggle">
                      Active Scheme on Public Directory
                    </label>
                  </div>
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
                      Saving Criteria...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check me-2"></i>{' '}
                      {isEditing ? 'Save Officer Scheme Updates' : 'Publish Scheme to Portal'}
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

export default SchemeFormModal;
