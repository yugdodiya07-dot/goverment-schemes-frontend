import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import schemeService from '../services/schemeService';
import { useAuth } from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import SchemeCard from '../components/schemes/SchemeCard';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import { calculateWeightedEligibility } from '../utils/eligibilityCalculator';

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

const SchemeList = ({ onOpenEligibilityWizard }) => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const debouncedSearch = useDebounce(search, 300);

  const fetchSchemes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        search: debouncedSearch,
        category,
        state,
        sortBy,
      };

      const res = await schemeService.getAllSchemes(params);
      setSchemes(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalItems(res.pagination?.totalItems || 0);

      // Sync URL params
      const newParams = new URLSearchParams();
      if (debouncedSearch) newParams.set('search', debouncedSearch);
      if (category) newParams.set('category', category);
      if (state) newParams.set('state', state);
      if (currentPage > 1) newParams.set('page', currentPage.toString());
      setSearchParams(newParams, { replace: true });
    } catch (error) {
      toast.error('Failed to load government scheme directory.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, category, state, sortBy, setSearchParams]);

  useEffect(() => {
    fetchSchemes();
  }, [fetchSchemes]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchSchemes();
  };

  const handleClearAll = () => {
    setSearch('');
    setCategory('');
    setState('');
    setSortBy('createdAt-desc');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleCategoryCheckbox = (cat) => {
    if (category === cat) {
      setCategory('');
    } else {
      setCategory(cat);
    }
    setCurrentPage(1);
  };

  const handleBookmarkToggle = async (schemeId) => {
    try {
      const res = await schemeService.toggleBookmark(schemeId);
      toast.success(res.message);
      if (refreshUser) refreshUser();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update bookmarked schemes.');
    }
  };

  const isSchemeBookmarked = (schemeId) => {
    if (!user || !user.savedSchemes) return false;
    return user.savedSchemes.some((item) =>
      typeof item === 'string' ? item === schemeId : item._id === schemeId
    );
  };

  return (
    <div className="scheme-list-page py-4 bg-light" style={{ minHeight: '88vh' }}>
      <div className="container py-2">
        {/* Page Header (Image 2 Top Title Strip) */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-2">
          <div>
            <h2 className="brand-font fw-bold mb-1" style={{ fontSize: '2rem' }}>
              All Government Schemes
            </h2>
            <p className="text-muted mb-0">
              Discover and apply for schemes that match your profile
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
                Schemes
              </li>
            </ol>
          </nav>
        </div>

        <div className="row g-4">
          {/* Left Sidebar Filter Panel (Image 2 Sidebar) */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '85px', zIndex: 10 }}>
              {/* Header: Filter Schemes + Clear All */}
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                <h6 className="brand-font fw-bold mb-0 text-dark">Filter Schemes</h6>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="btn btn-link p-0 text-decoration-none small fw-semibold"
                  style={{ color: '#16a34a', fontSize: '0.85rem' }}
                >
                  Clear All
                </button>
              </div>

              {/* Search Input */}
              <div className="mb-4">
                <div className="position-relative">
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                  <input
                    type="text"
                    className="form-control ps-5 py-2 border rounded-3 shadow-none"
                    placeholder="Search schemes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Categories Checkbox Filter */}
              <div className="mb-4">
                <h6 className="brand-font fw-bold mb-3 small text-dark">Categories</h6>
                <div className="d-flex flex-column gap-2">
                  <div className="form-check">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      id="cat-all"
                      checked={!category}
                      onChange={() => setCategory('')}
                    />
                    <label className="form-check-label small fw-semibold text-dark" htmlFor="cat-all">
                      All Categories
                    </label>
                  </div>
                  {ALL_CATEGORIES.map((catName) => (
                    <div className="form-check" key={catName}>
                      <input
                        className="form-check-input shadow-none"
                        type="checkbox"
                        id={`cat-${catName}`}
                        checked={category === catName}
                        onChange={() => handleCategoryCheckbox(catName)}
                      />
                      <label
                        className="form-check-label small text-muted"
                        htmlFor={`cat-${catName}`}
                      >
                        {catName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* State Dropdown */}
              <div className="mb-4">
                <h6 className="brand-font fw-bold mb-2 small text-dark">State</h6>
                <select
                  className="form-select form-select-sm py-2 px-3 border rounded-3 shadow-none text-muted"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">All States</option>
                  {ALL_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="mb-4">
                <h6 className="brand-font fw-bold mb-2 small text-dark">Sort By</h6>
                <select
                  className="form-select form-select-sm py-2 px-3 border rounded-3 shadow-none text-muted"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="createdAt-desc">Latest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <button
                type="button"
                onClick={handleApplyFilters}
                className="btn w-100 py-2 rounded-3 text-white fw-semibold shadow-sm"
                style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
              >
                <i className="bi bi-funnel me-1"></i> Apply Filters
              </button>
            </div>
          </div>

          {/* Right Main Schemes Directory Content */}
          <div className="col-lg-9">
            {/* Top Stats & View Mode Toolbar (Image 2 Top Bar) */}
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
              <span className="small fw-semibold text-dark">
                Showing{' '}
                <strong style={{ color: '#16a34a' }}>
                  {totalItems === 0 ? 0 : (currentPage - 1) * 12 + 1} to{' '}
                  {Math.min(currentPage * 12, totalItems)}
                </strong>{' '}
                of <strong>{totalItems || '120+'}</strong> schemes
              </span>

              <div className="d-flex align-items-center gap-3">
                {/* Sort By Shortcut */}
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted small">Sort By:</span>
                  <select
                    className="form-select form-select-sm py-1 px-3 border rounded-3 fw-semibold shadow-none"
                    style={{ width: '135px' }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="createdAt-desc">Latest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="title-asc">Title (A-Z)</option>
                  </select>
                </div>

                {/* View Toggle Buttons */}
                <div className="btn-group border rounded-3 p-1" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm border-0 rounded-2 px-2 py-1 ${
                      viewMode === 'grid'
                        ? 'btn-success text-white'
                        : 'btn-light text-muted'
                    }`}
                    style={viewMode === 'grid' ? { backgroundColor: '#16a34a' } : {}}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <i className="bi bi-grid-fill"></i>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm border-0 rounded-2 px-2 py-1 ${
                      viewMode === 'list'
                        ? 'btn-success text-white'
                        : 'btn-light text-muted'
                    }`}
                    style={viewMode === 'list' ? { backgroundColor: '#16a34a' } : {}}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <i className="bi bi-list-ul"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Scheme Directory List/Grid */}
            {loading ? (
              <Loader message="Querying national scheme database..." />
            ) : schemes.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-4 bg-white">
                <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                <h5 className="fw-bold">No matching government schemes found</h5>
                <p className="text-muted small mb-4">
                  We could not find any scheme matching your current search and demographic filters.
                </p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="btn btn-outline-success btn-sm px-4 rounded-pill mx-auto"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' ? 'row g-4 mb-4' : 'd-flex flex-column gap-3 mb-4'}>
                  {schemes.map((scheme) => {
                    let matchPercentage = null;
                    if (isAuthenticated && user?.profile) {
                      matchPercentage = calculateWeightedEligibility(user.profile, scheme);
                    }

                    return (
                      <div
                        key={scheme._id}
                        className={viewMode === 'grid' ? 'col-lg-4 col-md-6 col-sm-12' : 'w-100'}
                      >
                        <SchemeCard
                          scheme={scheme}
                          onBookmarkToggle={handleBookmarkToggle}
                          isBookmarked={isSchemeBookmarked(scheme._id)}
                          matchPercentage={matchPercentage}
                          viewMode={viewMode}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Pagination (Image 2 style) */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(p) => {
                        setCurrentPage(p);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeList;
