import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import schemeService from '../services/schemeService';
import emblemLogo from '../assets/logo/emblem.png';
import SchemeCard from '../components/schemes/SchemeCard';
import Loader from '../components/common/Loader';

const ALL_CATEGORIES = [
  'Education',
  'Agriculture',
  'Women',
  'Health',
  'Employment',
  'Business',
  'Senior Citizen',
  'Divyangjan',
];

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

const POPULAR_CATEGORIES = [
  { id: 'edu', title: 'Education', count: '45+ Schemes', icon: 'bi bi-mortarboard-fill', color: '#9333ea', bg: '#faf5ff' },
  { id: 'agr', title: 'Agriculture', count: '38+ Schemes', icon: 'bi bi-tractor', color: '#16a34a', bg: '#f0fdf4' },
  { id: 'wom', title: 'Women', count: '42+ Schemes', icon: 'bi bi-gender-female', color: '#e11d48', bg: '#fff1f2' },
  { id: 'hea', title: 'Health', count: '31+ Schemes', icon: 'bi bi-heart-pulse-fill', color: '#dc2626', bg: '#fef2f2' },
  { id: 'emp', title: 'Employment', count: '29+ Schemes', icon: 'bi bi-briefcase-fill', color: '#2563eb', bg: '#eff6ff' },
  { id: 'bus', title: 'Business', count: '43+ Schemes', icon: 'bi bi-buildings-fill', color: '#d97706', bg: '#fffbeb' },
  { id: 'sen', title: 'Senior Citizen', count: '22+ Schemes', icon: 'bi bi-person-heart', color: '#ca8a04', bg: '#fefce8' },
  { id: 'div', title: 'Divyangjan', count: '18+ Schemes', icon: 'bi bi-person-wheelchair', color: '#0d9488', bg: '#f0fdf4' },
];

const Home = ({ onOpenEligibilityWizard }) => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedSchemes = async () => {
      setLoading(true);
      try {
        const res = await schemeService.getAllSchemes({ limit: 6, sortBy: 'createdAt-desc' });
        if (res && res.data) {
          setSchemes(res.data);
        }
      } catch (error) {
        console.error('Home schemes load failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSchemes();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedState) params.set('state', selectedState);
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/schemes?${params.toString()}`);
  };

  return (
    <div className="home-page bg-light">
      {/* 1. Hero Section (Image 4 Dark Navy Hero) */}
      <section
        className="hero-section text-white position-relative overflow-hidden py-5"
        style={{
          background: 'linear-gradient(135deg, #07152b 0%, #0d274c 100%)',
          minHeight: '520px',
        }}
      >
        <div className="container py-4">
          <div className="row align-items-center g-5">
            {/* Left Hero Copy */}
            <div className="col-lg-7">
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3 mb-4">
                <img
                  src={emblemLogo}
                  alt="Government of India National Emblem"
                  style={{ height: '160px', width: 'auto', objectFit: 'contain' }}
                />
                <div>
                  <h2 className="brand-font fw-extrabold text-white mb-1" style={{ fontSize: '2rem', letterSpacing: '-0.01em' }}>
                    GovSmart India
                  </h2>
                  <p className="text-warning fw-semibold mb-2" style={{ fontSize: '1.05rem', letterSpacing: '0.5px' }}>
                    Smart Government Schemes Portal
                  </p>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 small fw-semibold">
                      <i className="bi bi-shield-check me-1"></i> Digital India Initiative
                    </span>
                    <span className="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill px-3 py-1 small fw-semibold">
                      <i className="bi bi-person-check-fill me-1"></i> 100% Aadhaar Verified
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="brand-font fw-extrabold mb-4 lh-sm" style={{ fontSize: '3.1rem', letterSpacing: '-0.02em' }}>
                Find Government Schemes You Are{' '}
                <span
                  className="position-relative d-inline-block px-3 py-1 rounded-3"
                  style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                >
                  Eligible
                </span>{' '}
                For
              </h1>

              <p className="text-white-50 fs-5 mb-4 pe-lg-4" style={{ lineHeight: '1.6' }}>
                Discover, check eligibility, and apply for 120+ Central and State government schemes tailored to your demographic profile—all in one place.
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <Link
                  to="/eligibility-checker"
                  className="btn px-4 py-3 rounded-3 text-white fw-semibold shadow-lg d-flex align-items-center gap-2"
                  style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', fontSize: '1.05rem' }}
                >
                  <span>Check Eligibility Now</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
                <Link
                  to="/schemes"
                  className="btn btn-outline-light px-4 py-3 rounded-3 fw-semibold d-flex align-items-center gap-2"
                  style={{ fontSize: '1.05rem' }}
                >
                  <span>Explore All Schemes</span>
                  <i className="bi bi-folder2-open"></i>
                </Link>
              </div>
            </div>

            {/* Right Hero Floating Quick Stats Card */}
            <div className="col-lg-5">
              <div
                className="card border-0 rounded-4 p-4 shadow-lg text-dark"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <h6 className="brand-font fw-bold mb-0 text-dark">Quick Portal Statistics</h6>
                  <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1 small">
                    Live
                  </span>
                </div>

                <div className="row g-3 text-center">
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light">
                      <h3 className="fw-bold mb-1" style={{ color: '#16a34a' }}>
                        120+
                      </h3>
                      <small className="text-muted fw-semibold d-block">Schemes Listed</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light">
                      <h3 className="fw-bold mb-1" style={{ color: '#9333ea' }}>
                        50L+
                      </h3>
                      <small className="text-muted fw-semibold d-block">Citizens Benefited</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light">
                      <h3 className="fw-bold mb-1" style={{ color: '#2563eb' }}>
                        100%
                      </h3>
                      <small className="text-muted fw-semibold d-block">Free & Transparent</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light">
                      <h3 className="fw-bold mb-1" style={{ color: '#d97706' }}>
                        8
                      </h3>
                      <small className="text-muted fw-semibold d-block">Welfares Covered</small>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 text-center border-top">
                  <small className="text-muted small">
                    <i className="bi bi-check-circle-fill text-success me-1"></i> Updated daily from Official Ministries
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Floating Search Bar Overlay Card (Image 4 Search Card) */}
      <div className="container" style={{ marginTop: '-45px', position: 'relative', zIndex: 20 }}>
        <div className="card border-0 shadow-lg rounded-4 p-3 bg-white">
          <form onSubmit={handleSearchSubmit}>
            <div className="row g-2 align-items-center">
              <div className="col-lg-5 col-md-12">
                <div className="position-relative">
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                  <input
                    type="text"
                    className="form-control ps-5 py-3 border-0 bg-light rounded-3 shadow-none"
                    placeholder="Search by scheme name, keyword or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <select
                  className="form-select py-3 border-0 bg-light rounded-3 shadow-none text-muted"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">All States</option>
                  {ALL_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-2 col-md-6">
                <select
                  className="form-select py-3 border-0 bg-light rounded-3 shadow-none text-muted"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-2 col-md-12">
                <button
                  type="submit"
                  className="btn w-100 py-3 rounded-3 text-white fw-semibold shadow-sm"
                  style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                >
                  <i className="bi bi-search me-1"></i> Search Schemes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Our Purpose Section (Why GovSmart India?) */}
      <section className="py-5 my-3">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 mb-2">
                Our Purpose
              </span>
              <h2 className="brand-font fw-bold mb-3" style={{ fontSize: '2.3rem' }}>
                Bridging citizens with government support
              </h2>
              <p className="text-muted mb-4" style={{ lineHeight: '1.7' }}>
                Millions of eligible Indian citizens miss out on government schemes due to lack of awareness or complex application procedures. GovSmart India simplifies discovery with an AI-driven eligibility engine that instantly evaluates your demographic profile against national and state welfare rules.
              </p>
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                    style={{ width: '36px', height: '36px', backgroundColor: '#16a34a' }}
                  >
                    <i className="bi bi-check-lg"></i>
                  </div>
                  <div>
                    <strong className="d-block text-dark small">Personalized AI Matching</strong>
                    <small className="text-muted">Calculates exact eligibility across 8 demographic factors</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                    style={{ width: '36px', height: '36px', backgroundColor: '#16a34a' }}
                  >
                    <i className="bi bi-check-lg"></i>
                  </div>
                  <div>
                    <strong className="d-block text-dark small">100% Official Source Verified</strong>
                    <small className="text-muted">Directly integrated with official Ministry portals and guidelines</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                    style={{ width: '36px', height: '36px', backgroundColor: '#16a34a' }}
                  >
                    <i className="bi bi-check-lg"></i>
                  </div>
                  <div>
                    <strong className="d-block text-dark small">Simple 4-Stage Application Tracking</strong>
                    <small className="text-muted">Track your application from submission to approval</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="card border-0 shadow-lg rounded-4 overflow-hidden position-relative p-4"
                style={{
                  background: 'linear-gradient(135deg, #07152b 0%, #0d274c 100%)',
                  minHeight: '340px',
                }}
              >
                <div className="text-white position-relative" style={{ zIndex: 2 }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <img
                      src={emblemLogo}
                      alt="Government of India National Emblem"
                      style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
                    />
                    <div>
                      <h5 className="fw-bold mb-0">GovSmart India</h5>
                      <small className="text-white-50">One Portal for Every Government Scheme</small>
                    </div>
                  </div>
                  <p className="text-white-50 small mb-4">
                    "Our goal is to ensure that no eligible citizen remains unserved by welfare schemes meant for their education, health, agriculture, and livelihood."
                  </p>
                  <Link
                    to="/about"
                    className="btn btn-sm btn-outline-light rounded-pill px-4 py-2"
                  >
                    Read Our Mission →
                  </Link>
                </div>
                <i
                  className="bi bi-building position-absolute bottom-0 end-0 m-3 text-white opacity-10"
                  style={{ fontSize: '10rem' }}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Popular Categories Section (Image 4 Categories) */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2">
            <div>
              <h3 className="brand-font fw-bold mb-1">Explore Scheme Categories</h3>
              <p className="text-muted small mb-0">Browse welfare schemes by your primary area of interest</p>
            </div>
            <Link
              to="/categories"
              className="btn btn-outline-success btn-sm px-3 rounded-pill fw-semibold"
            >
              View All Categories →
            </Link>
          </div>

          <div className="row g-4">
            {POPULAR_CATEGORIES.map((cat) => (
              <div key={cat.id} className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light category-hover-card"
                  style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                  onClick={() => navigate(`/schemes?category=${encodeURIComponent(cat.title)}`)}
                  role="button"
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '52px',
                      height: '52px',
                      backgroundColor: cat.bg,
                      color: cat.color,
                      fontSize: '1.5rem',
                    }}
                  >
                    <i className={cat.icon}></i>
                  </div>
                  <h6 className="brand-font fw-bold mb-1 text-dark">{cat.title}</h6>
                  <span className="small fw-semibold" style={{ color: '#16a34a' }}>
                    {cat.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Schemes Section (Image 4 Featured Schemes) */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2">
            <div>
              <h3 className="brand-font fw-bold mb-1">Featured Government Schemes</h3>
              <p className="text-muted small mb-0">Handpicked national welfare programs currently accepting applications</p>
            </div>
            <Link
              to="/schemes"
              className="btn btn-outline-success btn-sm px-3 rounded-pill fw-semibold"
            >
              View All Schemes →
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading featured schemes..." />
          ) : (
            <div className="row g-4">
              {schemes.slice(0, 3).map((scheme) => (
                <div key={scheme._id} className="col-lg-4 col-md-6 col-sm-12">
                  <SchemeCard scheme={scheme} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. How It Works in 4 Easy Steps (Image 4 How It Works) */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h3 className="brand-font fw-bold mb-2">How It Works in 4 Easy Steps</h3>
            <p className="text-muted small">
              Our streamlined process takes you from eligibility check to application submission in minutes
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center bg-light position-relative">
                <span
                  className="badge position-absolute top-0 start-50 translate-middle rounded-pill px-3 py-1 text-white fw-bold shadow-sm"
                  style={{ backgroundColor: '#16a34a' }}
                >
                  01
                </span>
                <div
                  className="rounded-circle mx-auto mt-2 mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: '56px', height: '56px', backgroundColor: '#f0fdf4', color: '#16a34a', fontSize: '1.6rem' }}
                >
                  <i className="bi bi-person-vcard"></i>
                </div>
                <h6 className="brand-font fw-bold mb-2">Enter Your Details</h6>
                <p className="text-muted small mb-0">
                  Fill basic demographic profile like age, income, state and category.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center bg-light position-relative">
                <span
                  className="badge position-absolute top-0 start-50 translate-middle rounded-pill px-3 py-1 text-white fw-bold shadow-sm"
                  style={{ backgroundColor: '#16a34a' }}
                >
                  02
                </span>
                <div
                  className="rounded-circle mx-auto mt-2 mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: '56px', height: '56px', backgroundColor: '#f0fdf4', color: '#16a34a', fontSize: '1.6rem' }}
                >
                  <i className="bi bi-cpu"></i>
                </div>
                <h6 className="brand-font fw-bold mb-2">Check Eligibility</h6>
                <p className="text-muted small mb-0">
                  Our AI engine matches your rules against 120+ official schemes.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center bg-light position-relative">
                <span
                  className="badge position-absolute top-0 start-50 translate-middle rounded-pill px-3 py-1 text-white fw-bold shadow-sm"
                  style={{ backgroundColor: '#16a34a' }}
                >
                  03
                </span>
                <div
                  className="rounded-circle mx-auto mt-2 mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: '56px', height: '56px', backgroundColor: '#f0fdf4', color: '#16a34a', fontSize: '1.6rem' }}
                >
                  <i className="bi bi-bookmark-heart"></i>
                </div>
                <h6 className="brand-font fw-bold mb-2">Explore & Save</h6>
                <p className="text-muted small mb-0">
                  Review eligible benefits, required documents and application deadlines.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center bg-light position-relative">
                <span
                  className="badge position-absolute top-0 start-50 translate-middle rounded-pill px-3 py-1 text-white fw-bold shadow-sm"
                  style={{ backgroundColor: '#16a34a' }}
                >
                  04
                </span>
                <div
                  className="rounded-circle mx-auto mt-2 mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: '56px', height: '56px', backgroundColor: '#f0fdf4', color: '#16a34a', fontSize: '1.6rem' }}
                >
                  <i className="bi bi-send-check"></i>
                </div>
                <h6 className="brand-font fw-bold mb-2">Apply & Track</h6>
                <p className="text-muted small mb-0">
                  Submit applications directly and track 4-stage verification status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. National Portal Statistics Banner (Image 4 Stats Banner) */}
      <section className="py-5 section-tint-success border-top border-bottom">
        <div className="container py-2">
          <div className="row g-4 text-center">
            <div className="col-lg-3 col-md-6">
              <div className="p-3">
                <i className="bi bi-folder-check fs-2" style={{ color: '#16a34a' }}></i>
                <h3 className="fw-bold mt-2 mb-1 text-dark">120+</h3>
                <span className="text-muted small fw-semibold">Active Schemes</span>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="p-3">
                <i className="bi bi-currency-rupee fs-2" style={{ color: '#9333ea' }}></i>
                <h3 className="fw-bold mt-2 mb-1 text-dark">₹15,000 Cr+</h3>
                <span className="text-muted small fw-semibold">Benefits Disbursed</span>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="p-3">
                <i className="bi bi-people-fill fs-2" style={{ color: '#2563eb' }}></i>
                <h3 className="fw-bold mt-2 mb-1 text-dark">50L+</h3>
                <span className="text-muted small fw-semibold">Registered Citizens</span>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="p-3">
                <i className="bi bi-map-fill fs-2" style={{ color: '#d97706' }}></i>
                <h3 className="fw-bold mt-2 mb-1 text-dark">28 States & 8 UTs</h3>
                <span className="text-muted small fw-semibold">Covered Across India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Citizen Testimonials / Success Stories */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h3 className="brand-font fw-bold mb-2">Stories of Impact & Empowerment</h3>
            <p className="text-muted small">See how Indian citizens discovered and benefited from government schemes</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light">
                <div className="d-flex align-items-center gap-1 text-warning mb-3">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p className="text-muted small mb-4 fst-italic">
                  "I was not aware of the PM Kisan Samman Nidhi rules. This portal calculated my eligibility in seconds and helped me submit my documents."
                </p>
                <div className="d-flex align-items-center gap-3 mt-auto">
                  <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                    RK
                  </div>
                  <div>
                    <strong className="d-block small text-dark mb-0">Ramesh Kumar</strong>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Farmer, Uttar Pradesh</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light">
                <div className="d-flex align-items-center gap-1 text-warning mb-3">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p className="text-muted small mb-4 fst-italic">
                  "As a female college student, I discovered two national education scholarships here that funded my full undergraduate tuition."
                </p>
                <div className="d-flex align-items-center gap-3 mt-auto">
                  <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                    SD
                  </div>
                  <div>
                    <strong className="d-block small text-dark mb-0">Sunita Devi</strong>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Student, Maharashtra</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-12">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light">
                <div className="d-flex align-items-center gap-1 text-warning mb-3">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p className="text-muted small mb-4 fst-italic">
                  "The PM Mudra Loan eligibility checker made it so easy to understand what documents my enterprise needed before applying."
                </p>
                <div className="d-flex align-items-center gap-3 mt-auto">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                    RS
                  </div>
                  <div>
                    <strong className="d-block small text-dark mb-0">Rajesh Sharma</strong>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Small Business Owner, Gujarat</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Bottom CTA Banner (Image 4 Bottom Banner) */}
      <section
        className="py-5 text-white text-center position-relative"
        style={{
          background: 'linear-gradient(135deg, #07152b 0%, #0d274c 100%)',
          borderBottom: '4px solid #16a34a',
        }}
      >
        <div className="container py-4">
          <h2 className="brand-font fw-bold mb-3" style={{ fontSize: '2.4rem' }}>
            Ready to find the right schemes for you?
          </h2>
          <p className="text-white-50 small mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            Take our 2-minute Smart Eligibility check and receive a personalized list of central and state welfare benefits.
          </p>
          <Link
            to="/eligibility-checker"
            className="btn px-5 py-3 rounded-pill text-white fw-semibold shadow-lg d-inline-flex align-items-center gap-2"
            style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', fontSize: '1.1rem' }}
          >
            <span>Check Eligibility Now</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
