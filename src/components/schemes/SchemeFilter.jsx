import React from 'react';
import { SCHEME_CATEGORIES, INDIAN_STATES, BENEFIT_TYPES } from '../../utils/constants';

const SchemeFilter = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  state,
  onStateChange,
  benefitType,
  onBenefitTypeChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="glass-card p-4 mb-4">
      <div className="row g-3 align-items-center">
        {/* Search Bar */}
        <div className="col-lg-4 col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-transparent border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 shadow-none"
              placeholder="Search schemes, ministries, benefits..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {search && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={() => onSearchChange('')}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="col-lg-2 col-md-6">
          <select
            className="form-select shadow-none"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {SCHEME_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* State Filter */}
        <div className="col-lg-2 col-md-6">
          <select
            className="form-select shadow-none"
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
          >
            <option value="">All States / UTs</option>
            {INDIAN_STATES.filter((s) => s !== 'All').map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Benefit Type Filter */}
        <div className="col-lg-2 col-md-6">
          <select
            className="form-select shadow-none"
            value={benefitType}
            onChange={(e) => onBenefitTypeChange(e.target.value)}
          >
            <option value="">All Benefits</option>
            {BENEFIT_TYPES.filter((b) => b !== 'All').map((ben) => (
              <option key={ben} value={ben}>
                {ben}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting & Clear */}
        <div className="col-lg-2 col-md-12 d-flex gap-2">
          <select
            className="form-select shadow-none"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>

          <button
            onClick={onReset}
            className="btn btn-outline-secondary d-flex align-items-center justify-content-center px-3"
            title="Reset All Filters"
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemeFilter;
