import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="about-us-page bg-light" style={{ minHeight: '88vh' }}>
      {/* Header Banner */}
      <div
        className="py-5 text-white position-relative"
        style={{
          background: 'linear-gradient(135deg, #07152b 0%, #0d274c 100%)',
          borderBottom: '4px solid #16a34a',
        }}
      >
        <div className="container py-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2 small fw-semibold">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-white-50">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">
                About Us
              </li>
            </ol>
          </nav>
          <h1 className="brand-font fw-bold mb-2" style={{ fontSize: '2.5rem' }}>
            About <span style={{ color: '#16a34a' }}>GovSmart India</span>
          </h1>
          <p className="text-white-50 mb-0" style={{ maxWidth: '680px', lineHeight: '1.6' }}>
            Bridging the gap between Indian citizens and national welfare schemes through transparent, AI-powered digital governance.
          </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Mission & Digital India Section */}
        <div className="row g-4 mb-5 align-items-center">
          <div className="col-lg-6">
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 mb-3">
              <i className="bi bi-shield-check me-1"></i> Digital India Initiative
            </span>
            <h2 className="brand-font fw-bold mb-3">
              Empowering Citizens Through Information
            </h2>
            <p className="text-muted mb-4" style={{ lineHeight: '1.7' }}>
              GovSmart India is a unified digital platform developed to simplify the discovery and application process for central and state government welfare schemes. Using an 8-factor demographic weighted eligibility engine, we ensure every citizen receives accurate recommendations tailored to their age, income, occupation, social category, and region.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-3 shadow-sm border">
                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                <span className="small fw-semibold">100% Verified Schemes</span>
              </div>
              <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-3 shadow-sm border">
                <i className="bi bi-lock-fill text-success fs-5"></i>
                <span className="small fw-semibold">Zero Data Selling</span>
              </div>
              <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-3 shadow-sm border">
                <i className="bi bi-lightning-charge-fill text-success fs-5"></i>
                <span className="small fw-semibold">Instant AI Eligibility</span>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="row g-3 text-center">
                <div className="col-6">
                  <div className="p-4 rounded-3 bg-light">
                    <h3 className="fw-bold mb-1" style={{ color: '#16a34a' }}>120+</h3>
                    <small className="text-muted fw-semibold">National Schemes</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 rounded-3 bg-light">
                    <h3 className="fw-bold mb-1" style={{ color: '#9333ea' }}>8</h3>
                    <small className="text-muted fw-semibold">Welfare Categories</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 rounded-3 bg-light">
                    <h3 className="fw-bold mb-1" style={{ color: '#2563eb' }}>100%</h3>
                    <small className="text-muted fw-semibold">Free for Citizens</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 rounded-3 bg-light">
                    <h3 className="fw-bold mb-1" style={{ color: '#d97706' }}>24/7</h3>
                    <small className="text-muted fw-semibold">Digital Access</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions (FAQs) */}
        <div id="faqs" className="card border-0 shadow-sm rounded-4 p-5 mb-5 bg-white">
          <h4 className="brand-font fw-bold mb-4 text-center">
            Frequently Asked <span style={{ color: '#16a34a' }}>Questions</span>
          </h4>
          <div className="accordion" id="aboutFaqAccordion">
            <div className="accordion-item border-0 mb-3 rounded-3 shadow-sm overflow-hidden">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button fw-semibold shadow-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  How does the 8-factor Smart Eligibility Checker work?
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#aboutFaqAccordion"
              >
                <div className="accordion-body text-muted small">
                  Our algorithm matches your demographic profile—including Age (20%), Annual Income (20%), Occupation (20%), Gender (10%), State (10%), Social Category (10%), Disability Status (5%), and Special Status (5%)—against official government scheme eligibility rules to calculate a match percentage.
                </div>
              </div>
            </div>

            <div className="accordion-item border-0 mb-3 rounded-3 shadow-sm overflow-hidden">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed fw-semibold shadow-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Is my personal and Aadhaar information secure?
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#aboutFaqAccordion"
              >
                <div className="accordion-body text-muted small">
                  Yes, GovSmart India adheres strictly to India's Digital Personal Data Protection guidelines. Your profile is encrypted using industry-standard bcrypt and JWT tokens, and is never shared with third parties.
                </div>
              </div>
            </div>

            <div className="accordion-item border-0 rounded-3 shadow-sm overflow-hidden">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className="accordion-button collapsed fw-semibold shadow-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  How can I check the verification status of my submitted application?
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#aboutFaqAccordion"
              >
                <div className="accordion-body text-muted small">
                  Once logged in, navigate to your Citizen Dashboard to track your application across our 4-Stage Verification Timeline: Submitted → Under Verification → Document Verified → Approved / Rejected.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Sections anchors */}
        <div id="privacy" className="mb-4">
          <h5 className="fw-bold">Privacy Policy</h5>
          <p className="text-muted small">
            GovSmart India protects citizen privacy in compliance with national standards. We only collect required demographic data to calculate scheme eligibility and facilitate official applications.
          </p>
        </div>
        <div id="terms" className="mb-4">
          <h5 className="fw-bold">Terms & Conditions</h5>
          <p className="text-muted small">
            By using GovSmart India, you agree to provide truthful demographic information when checking eligibility or submitting welfare applications.
          </p>
        </div>
        <div id="disclaimer" className="mb-4">
          <h5 className="fw-bold">Disclaimer</h5>
          <p className="text-muted small">
            GovSmart India is a public informational portal designed to simplify scheme discovery. For official legal disbursements, users are also directed to respective Ministry websites.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
