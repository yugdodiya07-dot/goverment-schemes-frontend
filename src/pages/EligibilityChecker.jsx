import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import schemeService from '../services/schemeService';
import SchemeCard from '../components/schemes/SchemeCard';
import Loader from '../components/common/Loader';
import { calculateWeightedEligibility } from '../utils/eligibilityCalculator';

const ALL_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const EligibilityChecker = () => {
  const [step, setStep] = useState(1); // 1, 2, 3, 4 (4 = Results)
  const [loadingResults, setLoadingResults] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [eligibleResults, setEligibleResults] = useState([]);

  const [formData, setFormData] = useState({
    dob: '',
    age: '',
    gender: 'Male',
    state: 'Delhi',
    annualIncome: '150000',
    occupation: 'Farmer / Agricultural',
    category: 'General / Unreserved',
    disabilityStatus: 'No',
    isBPL: false,
    isMinority: false,
    isExServiceman: false,
    isSingleGirlChild: false,
  });

  const navigate = useNavigate();

  // Load all schemes so we can run AI matching
  useEffect(() => {
    const fetchAllSchemes = async () => {
      try {
        const res = await schemeService.getAllSchemes({ limit: 100 });
        if (res && res.data) {
          setSchemes(res.data);
        }
      } catch (err) {
        console.error('Failed to load schemes for eligibility calculation:', err);
      }
    };
    fetchAllSchemes();
  }, []);

  // Auto calculate age from DOB
  const handleDobChange = (e) => {
    const dateVal = e.target.value;
    let computedAge = '';
    if (dateVal) {
      const birthDate = new Date(dateVal);
      const today = new Date();
      let a = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        a--;
      }
      if (a >= 0 && a <= 120) {
        computedAge = a.toString();
      }
    }
    setFormData((prev) => ({
      ...prev,
      dob: dateVal,
      age: computedAge,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.age && !formData.dob) {
      toast.error('Please select your Date of Birth or enter your Age.');
      return false;
    }
    if (!formData.state) {
      toast.error('Please select your State or Union Territory.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.annualIncome) {
      toast.error('Please enter your Annual Family Income.');
      return false;
    }
    if (!formData.occupation) {
      toast.error('Please select your primary occupation.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleCheckEligibility = () => {
    setLoadingResults(true);
    setStep(4); // View Results

    // Convert formData to demographic profile format expected by calculateWeightedEligibility
    const userProfile = {
      age: Number(formData.age) || 25,
      gender: formData.gender.toLowerCase(),
      state: formData.state,
      annualIncome: Number(formData.annualIncome) || 100000,
      occupation: formData.occupation.toLowerCase(),
      category: formData.category.split(' ')[0].toLowerCase(), // e.g. 'general', 'obc', 'sc', 'st'
      disabilityStatus: formData.disabilityStatus.toLowerCase().startsWith('yes')
        ? 'yes (40% or more)'
        : 'no',
      specialStatus: [
        formData.isBPL ? 'BPL' : null,
        formData.isMinority ? 'Minority' : null,
        formData.isExServiceman ? 'Ex-Serviceman' : null,
        formData.isSingleGirlChild ? 'Single Girl Child' : null,
      ].filter(Boolean),
    };

    setTimeout(() => {
      const results = schemes.map((sch) => {
        const match = calculateWeightedEligibility(userProfile, sch);
        return {
          ...sch,
          matchPercentage: match,
        };
      });

      // Sort by highest match percentage first
      results.sort((a, b) => b.matchPercentage - a.matchPercentage);
      setEligibleResults(results);
      setLoadingResults(false);
      toast.success('Smart AI eligibility matching complete!');
    }, 600);
  };

  const handleRestart = () => {
    setStep(1);
  };

  return (
    <div className="eligibility-checker-page bg-light" style={{ minHeight: '88vh' }}>
      {/* 1. Header Banner (Image 5 Navy Hero) */}
      <div
        className="py-5 text-white position-relative"
        style={{
          background: 'linear-gradient(135deg, #07152b 0%, #0d274c 100%)',
          borderBottom: '4px solid #16a34a',
        }}
      >
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2 small fw-semibold">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-decoration-none text-white-50">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active text-white" aria-current="page">
                    Eligibility Checker
                  </li>
                </ol>
              </nav>
              <h1 className="brand-font fw-bold mb-2" style={{ fontSize: '2.5rem' }}>
                Smart Eligibility <span style={{ color: '#16a34a' }}>Checker</span>
              </h1>
              <p className="text-white-50 mb-0" style={{ maxWidth: '640px', lineHeight: '1.6' }}>
                Answer a few simple questions about yourself to find all the central and state government schemes you are eligible for.
              </p>
            </div>
            <div className="col-lg-4 d-none d-lg-flex justify-content-end gap-3 text-white-50 opacity-25">
              <i className="bi bi-magic" style={{ fontSize: '3.5rem' }}></i>
              <i className="bi bi-person-check-fill" style={{ fontSize: '3.5rem' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content (Image 5 3-Column Layout) */}
      <div className="container py-5">
        {step === 4 ? (
          /* Results View */
          <div>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 p-4 bg-white rounded-4 shadow-sm">
              <div>
                <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 mb-2">
                  AI Matching Complete
                </span>
                <h4 className="brand-font fw-bold mb-1">
                  Your Personalized Scheme Recommendations
                </h4>
                <p className="text-muted small mb-0">
                  Based on your demographic profile (Age: <strong>{formData.age || '25'}</strong>, State: <strong>{formData.state}</strong>, Income: <strong>₹{Number(formData.annualIncome).toLocaleString('en-IN')}</strong>), here are your matching schemes:
                </p>
              </div>
              <button
                type="button"
                onClick={handleRestart}
                className="btn btn-outline-success rounded-pill px-4 py-2 fw-semibold flex-shrink-0"
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i> Recalculate Profile
              </button>
            </div>

            {loadingResults ? (
              <Loader message="Running 8-factor eligibility matching engine..." />
            ) : eligibleResults.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
                <i className="bi bi-folder-x fs-1 text-muted mb-3 d-block"></i>
                <h5 className="fw-bold">No schemes matched your exact criteria</h5>
                <p className="text-muted small mb-4">
                  Try adjusting your income or occupation rules to view available welfare programs.
                </p>
                <button onClick={handleRestart} className="btn btn-success btn-sm px-4 rounded-pill">
                  Try Again
                </button>
              </div>
            ) : (
              <div className="row g-4 mb-5">
                {eligibleResults.map((sch) => (
                  <div key={sch._id} className="col-lg-4 col-md-6 col-sm-12">
                    <SchemeCard
                      scheme={sch}
                      matchPercentage={sch.matchPercentage}
                      viewMode="grid"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* 3-Step Wizard View */
          <div className="row g-4">
            {/* Left Column: Step Navigation (Image 5 Left Sidebar) */}
            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <h6 className="brand-font fw-bold mb-3 text-dark">Eligibility Steps</h6>
                <div className="d-flex flex-column gap-3">
                  {/* Step 1 Pill */}
                  <div
                    className={`p-3 rounded-3 d-flex align-items-center gap-3 border ${
                      step === 1 ? 'border-success bg-light' : 'border-light'
                    }`}
                    style={step === 1 ? { borderLeft: '4px solid #16a34a !important' } : {}}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: step >= 1 ? '#16a34a' : '#e5e7eb',
                        color: step >= 1 ? '#ffffff' : '#6b7280',
                      }}
                    >
                      {step > 1 ? <i className="bi bi-check-lg"></i> : '1'}
                    </div>
                    <div>
                      <strong className="d-block small text-dark">Personalized Details</strong>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Age, Gender, State
                      </small>
                    </div>
                  </div>

                  {/* Step 2 Pill */}
                  <div
                    className={`p-3 rounded-3 d-flex align-items-center gap-3 border ${
                      step === 2 ? 'border-success bg-light' : 'border-light'
                    }`}
                    style={step === 2 ? { borderLeft: '4px solid #16a34a !important' } : {}}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: step >= 2 ? '#16a34a' : '#e5e7eb',
                        color: step >= 2 ? '#ffffff' : '#6b7280',
                      }}
                    >
                      {step > 2 ? <i className="bi bi-check-lg"></i> : '2'}
                    </div>
                    <div>
                      <strong className="d-block small text-dark">Economic & Social</strong>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Income, Category, Occupation
                      </small>
                    </div>
                  </div>

                  {/* Step 3 Pill */}
                  <div
                    className={`p-3 rounded-3 d-flex align-items-center gap-3 border ${
                      step === 3 ? 'border-success bg-light' : 'border-light'
                    }`}
                    style={step === 3 ? { borderLeft: '4px solid #16a34a !important' } : {}}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: step >= 3 ? '#16a34a' : '#e5e7eb',
                        color: step >= 3 ? '#ffffff' : '#6b7280',
                      }}
                    >
                      3
                    </div>
                    <div>
                      <strong className="d-block small text-dark">Special Status</strong>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Disability, BPL, Minority
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help Box */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white text-center">
                <div
                  className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                  style={{ width: '48px', height: '48px', backgroundColor: '#f0fdf4', color: '#16a34a' }}
                >
                  <i className="bi bi-headset fs-4"></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">Need Help?</h6>
                <p className="text-muted small mb-2">Our support staff is ready to assist you</p>
                <strong className="text-success d-block small">1800-123-4567</strong>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>Toll Free Support</small>
              </div>
            </div>

            {/* Middle Column: Interactive Step Form (Image 5 Center Card) */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                {/* Step Header & Progress Bar */}
                <div className="mb-4 pb-3 border-bottom">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h5 className="brand-font fw-bold mb-0 text-dark">
                      {step === 1 && 'Step 1: Personal Details'}
                      {step === 2 && 'Step 2: Economic & Social Details'}
                      {step === 3 && 'Step 3: Special Status & Criteria'}
                    </h5>
                    <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 small">
                      Step {step} of 3
                    </span>
                  </div>
                  <div className="progress" style={{ height: '8px', backgroundColor: '#e5e7eb' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${(step / 3) * 100}%`,
                        backgroundColor: '#16a34a',
                      }}
                    ></div>
                  </div>
                </div>

                {/* STEP 1 FORM */}
                {step === 1 && (
                  <div>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-dark">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          name="dob"
                          className="form-control py-2 px-3 border rounded-3 small shadow-none"
                          value={formData.dob}
                          onChange={handleDobChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-dark">
                          Age (Years) *
                        </label>
                        <input
                          type="number"
                          name="age"
                          className="form-control py-2 px-3 border rounded-3 small shadow-none"
                          placeholder="e.g. 25"
                          value={formData.age}
                          onChange={handleChange}
                        />
                        {formData.age && (
                          <small className="text-success fw-semibold" style={{ fontSize: '0.75rem' }}>
                            <i className="bi bi-check-circle-fill me-1"></i> Calculated Age: {formData.age} Years
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-dark d-block">
                        Gender *
                      </label>
                      <div className="d-flex gap-4">
                        {['Male', 'Female', 'Transgender / Other'].map((g) => (
                          <div className="form-check" key={g}>
                            <input
                              className="form-check-input shadow-none"
                              type="radio"
                              name="gender"
                              id={`gender-${g}`}
                              value={g}
                              checked={formData.gender === g}
                              onChange={handleChange}
                            />
                            <label className="form-check-label small text-dark" htmlFor={`gender-${g}`}>
                              {g}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-dark">
                        State / Union Territory *
                      </label>
                      <select
                        name="state"
                        className="form-select py-2 px-3 border rounded-3 small shadow-none text-dark"
                        value={formData.state}
                        onChange={handleChange}
                      >
                        {ALL_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="d-flex justify-content-end pt-3 border-top">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn px-4 py-2 rounded-3 text-white fw-semibold shadow-sm d-flex align-items-center gap-2"
                        style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                      >
                        <span>Next Step</span>
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 FORM */}
                {step === 2 && (
                  <div>
                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-dark">
                        Annual Family Income (₹) *
                      </label>
                      <input
                        type="number"
                        name="annualIncome"
                        className="form-control py-2 px-3 border rounded-3 small shadow-none"
                        placeholder="e.g. 150000"
                        value={formData.annualIncome}
                        onChange={handleChange}
                      />
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Enter numeric family income from all sources (e.g. 150000 for 1.5 Lakhs)
                      </small>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-dark">
                        Primary Occupation / Employment *
                      </label>
                      <select
                        name="occupation"
                        className="form-select py-2 px-3 border rounded-3 small shadow-none text-dark"
                        value={formData.occupation}
                        onChange={handleChange}
                      >
                        <option value="Farmer / Agricultural">Farmer / Agricultural</option>
                        <option value="Student">Student</option>
                        <option value="Self-Employed / Business">Self-Employed / Business</option>
                        <option value="Unemployed">Unemployed</option>
                        <option value="Private Sector Employee">Private Sector Employee</option>
                        <option value="Government Employee">Government Employee</option>
                        <option value="Daily Wage Worker">Daily Wage Worker</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-dark">
                        Social Category *
                      </label>
                      <select
                        name="category"
                        className="form-select py-2 px-3 border rounded-3 small shadow-none text-dark"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="General / Unreserved">General / Unreserved</option>
                        <option value="OBC (Other Backward Class)">OBC (Other Backward Class)</option>
                        <option value="SC (Scheduled Caste)">SC (Scheduled Caste)</option>
                        <option value="ST (Scheduled Tribe)">ST (Scheduled Tribe)</option>
                        <option value="EWS (Economically Weaker Section)">EWS (Economically Weaker Section)</option>
                      </select>
                    </div>

                    <div className="d-flex justify-content-between pt-3 border-top">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="btn btn-outline-secondary px-4 py-2 rounded-3 small fw-semibold"
                      >
                        <i className="bi bi-arrow-left me-1"></i> Previous Step
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn px-4 py-2 rounded-3 text-white fw-semibold shadow-sm d-flex align-items-center gap-2"
                        style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                      >
                        <span>Next Step</span>
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 FORM */}
                {step === 3 && (
                  <div>
                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-dark d-block">
                        Disability Status (Divyangjan) *
                      </label>
                      <div className="d-flex flex-column gap-2">
                        {[
                          'No',
                          'Yes (40% or more)',
                          'Yes (Less than 40%)',
                        ].map((opt) => (
                          <div className="form-check" key={opt}>
                            <input
                              className="form-check-input shadow-none"
                              type="radio"
                              name="disabilityStatus"
                              id={`dis-${opt}`}
                              value={opt}
                              checked={formData.disabilityStatus === opt}
                              onChange={handleChange}
                            />
                            <label className="form-check-label small text-dark" htmlFor={`dis-${opt}`}>
                              {opt}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-dark d-block">
                        Special Status (Select all that apply)
                      </label>
                      <div className="d-flex flex-column gap-2">
                        <div className="form-check">
                          <input
                            className="form-check-input shadow-none"
                            type="checkbox"
                            id="spec-bpl"
                            name="isBPL"
                            checked={formData.isBPL}
                            onChange={handleChange}
                          />
                          <label className="form-check-label small text-dark" htmlFor="spec-bpl">
                            BPL (Below Poverty Line) Card Holder
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input shadow-none"
                            type="checkbox"
                            id="spec-min"
                            name="isMinority"
                            checked={formData.isMinority}
                            onChange={handleChange}
                          />
                          <label className="form-check-label small text-dark" htmlFor="spec-min">
                            Minority Community
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input shadow-none"
                            type="checkbox"
                            id="spec-ex"
                            name="isExServiceman"
                            checked={formData.isExServiceman}
                            onChange={handleChange}
                          />
                          <label className="form-check-label small text-dark" htmlFor="spec-ex">
                            Ex-Serviceman / Defense Personnel
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input shadow-none"
                            type="checkbox"
                            id="spec-girl"
                            name="isSingleGirlChild"
                            checked={formData.isSingleGirlChild}
                            onChange={handleChange}
                          />
                          <label className="form-check-label small text-dark" htmlFor="spec-girl">
                            Single Girl Child
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between pt-3 border-top">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="btn btn-outline-secondary px-4 py-2 rounded-3 small fw-semibold"
                      >
                        <i className="bi bi-arrow-left me-1"></i> Previous Step
                      </button>
                      <button
                        type="button"
                        onClick={handleCheckEligibility}
                        className="btn px-4 py-2 rounded-3 text-white fw-semibold shadow-sm d-flex align-items-center gap-2"
                        style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                      >
                        <span>Check Eligible Schemes</span>
                        <i className="bi bi-patch-check-fill"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: How It Works Assurance (Image 5 Right Card) */}
            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <h6 className="brand-font fw-bold mb-3 text-dark">How It Works</h6>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-success mt-1"></i>
                    <div>
                      <strong className="d-block small text-dark">100% Free & Transparent</strong>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        No fees or middlemen required
                      </small>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-success mt-1"></i>
                    <div>
                      <strong className="d-block small text-dark">Official Ministry Rules</strong>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Rules sourced from India.gov.in
                      </small>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-success mt-1"></i>
                    <div>
                      <strong className="d-block small text-dark">Instant AI Matching</strong>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        8 demographic factors evaluated
                      </small>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-success mt-1"></i>
                    <div>
                      <strong className="d-block small text-dark">Aadhaar Safe & Secure</strong>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Zero personal data sharing
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why check eligibility box */}
              <div className="card border-0 shadow-sm rounded-4 p-4 section-tint-success">
                <h6 className="fw-bold mb-2 text-dark">Why check eligibility?</h6>
                <p className="text-muted small mb-0" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Save time by only applying for schemes where you meet 100% of the government criteria.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityChecker;
