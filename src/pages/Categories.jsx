import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES_DATA = [
  {
    id: 'education',
    title: 'Education',
    schemeCount: '45+ Schemes',
    rawCount: 45,
    description: 'Scholarships, student aid, school education and skill development.',
    icon: 'bi bi-mortarboard-fill',
    color: '#9333ea',
    bg: '#faf5ff',
    categoryName: 'Education',
  },
  {
    id: 'agriculture',
    title: 'Agriculture',
    schemeCount: '38+ Schemes',
    rawCount: 38,
    description: 'Financial assistance, equipment support and farmer welfare schemes.',
    icon: 'bi bi-tractor',
    color: '#16a34a',
    bg: '#f0fdf4',
    categoryName: 'Agriculture',
  },
  {
    id: 'women',
    title: 'Women',
    schemeCount: '42+ Schemes',
    rawCount: 42,
    description: 'Empowerment, financial aid, safety and benefits for women.',
    icon: 'bi bi-gender-female',
    color: '#e11d48',
    bg: '#fff1f2',
    categoryName: 'Women',
  },
  {
    id: 'health',
    title: 'Health',
    schemeCount: '31+ Schemes',
    rawCount: 31,
    description: 'Health insurance, medical support and wellness programs.',
    icon: 'bi bi-heart-pulse-fill',
    color: '#dc2626',
    bg: '#fef2f2',
    categoryName: 'Health',
  },
  {
    id: 'employment',
    title: 'Employment',
    schemeCount: '29+ Schemes',
    rawCount: 29,
    description: 'Job creation, skill training and employment generation.',
    icon: 'bi bi-briefcase-fill',
    color: '#2563eb',
    bg: '#eff6ff',
    categoryName: 'Employment',
  },
  {
    id: 'business',
    title: 'Business',
    schemeCount: '43+ Schemes',
    rawCount: 43,
    description: 'Loans, subsidies and support for startups and businesses.',
    icon: 'bi bi-buildings-fill',
    color: '#d97706',
    bg: '#fffbeb',
    categoryName: 'Business',
  },
  {
    id: 'senior_citizen',
    title: 'Senior Citizen',
    schemeCount: '22+ Schemes',
    rawCount: 22,
    description: 'Pensions, healthcare and benefits for senior citizens.',
    icon: 'bi bi-person-heart',
    color: '#ca8a04',
    bg: '#fefce8',
    categoryName: 'Senior Citizen',
  },
  {
    id: 'divyangjan',
    title: 'Divyangjan',
    schemeCount: '18+ Schemes',
    rawCount: 18,
    description: 'Support, assistive devices and benefits for persons with disabilities.',
    icon: 'bi bi-person-wheelchair',
    color: '#0d9488',
    bg: '#f0fdf4',
    categoryName: 'Divyangjan',
  },
];

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Popular');
  const navigate = useNavigate();

  const filteredCategories = useMemo(() => {
    let list = CATEGORIES_DATA.filter(
      (cat) =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'Alphabetical') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'SchemeCount') {
      list = [...list].sort((a, b) => b.rawCount - a.rawCount);
    }
    return list;
  }, [searchQuery, sortBy]);

  return (
    <div className="categories-page py-4 bg-light" style={{ minHeight: '85vh' }}>
      <div className="container py-3">
        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-2">
          <div>
            <h2 className="brand-font fw-bold mb-1" style={{ fontSize: '2rem' }}>
              Scheme <span style={{ color: '#16a34a' }}>Categories</span>
            </h2>
            <p className="text-muted mb-0">
              Explore government schemes by different categories and find the best ones for you.
            </p>
          </div>
          <nav aria-label="breadcrumb" className="mt-2 mt-md-0">
            <ol className="breadcrumb mb-0 small fw-semibold">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-muted">
                  <i className="bi bi-house-door me-1"></i>Home
                </Link>
              </li>
              <li className="breadcrumb-item active text-dark" aria-current="page">
                Categories
              </li>
            </ol>
          </nav>
        </div>

        {/* Search & Sort Bar */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div className="position-relative flex-grow-1 w-100" style={{ maxWidth: '480px' }}>
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type="text"
                className="form-control ps-5 py-2 border rounded-3 shadow-none"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="d-flex align-items-center gap-2 w-100 w-md-auto justify-content-md-end">
              <span className="text-muted small fw-semibold text-nowrap">Sort By:</span>
              <select
                className="form-select form-select-sm py-2 px-3 border rounded-3 fw-semibold shadow-none"
                style={{ width: '160px' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Popular">Popular</option>
                <option value="Alphabetical">Name (A-Z)</option>
                <option value="SchemeCount">Scheme Count</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Card Grid (4 columns x 2 rows) */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-5 my-4 bg-white rounded-4 shadow-sm">
            <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold">No matching categories found</h5>
            <p className="text-muted small mb-3">Try searching with different keywords</p>
            <button
              className="btn btn-outline-success btn-sm px-4 rounded-pill"
              onClick={() => setSearchQuery('')}
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="row g-4 mb-5">
            {filteredCategories.map((cat) => (
              <div key={cat.id} className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className="card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-column justify-content-between bg-white category-hover-card"
                  style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                  onClick={() => navigate(`/schemes?category=${encodeURIComponent(cat.categoryName)}`)}
                  role="button"
                >
                  <div>
                    {/* Badge Icon */}
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: cat.bg,
                        color: cat.color,
                        fontSize: '1.6rem',
                      }}
                    >
                      <i className={cat.icon}></i>
                    </div>

                    {/* Title & Scheme Count */}
                    <h5 className="brand-font fw-bold mb-1 text-dark">{cat.title}</h5>
                    <span
                      className="fw-semibold d-inline-block mb-3"
                      style={{ color: '#16a34a', fontSize: '0.85rem' }}
                    >
                      {cat.schemeCount}
                    </span>

                    {/* Description */}
                    <p className="text-muted small mb-4" style={{ lineHeight: '1.5' }}>
                      {cat.description}
                    </p>
                  </div>

                  {/* View Schemes Link */}
                  <div
                    className="d-flex align-items-center gap-1 fw-semibold small mt-auto"
                    style={{ color: cat.color }}
                  >
                    <span>View Schemes</span>
                    <i className="bi bi-arrow-right"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA Banner (Image 1 Bottom Banner) */}
        <div className="card border-0 rounded-4 p-4 shadow-sm mb-3 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 section-tint-success">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: '52px',
                height: '52px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                fontSize: '1.5rem',
              }}
            >
              <i className="bi bi-gift-fill"></i>
            </div>
            <div>
              <h6 className="fw-bold mb-1 text-dark">Can't find what you're looking for?</h6>
              <p className="text-muted small mb-0">
                Use our Eligibility Checker and get personalized scheme recommendations.
              </p>
            </div>
          </div>
          <Link
            to="/eligibility-checker"
            className="btn px-4 py-2 rounded-3 text-white fw-semibold flex-shrink-0 shadow-sm"
            style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
          >
            Check Eligibility Now →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;
