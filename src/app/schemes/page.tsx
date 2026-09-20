'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '../../lib/api';
import { IScheme, ICategory } from '../../types';
import { SchemeCard } from '../../components/schemes/SchemeCard';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, RotateCcw, Landmark, Sparkles } from 'lucide-react';

function SchemesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialState = searchParams.get('state') || 'All';
  const initialLevel = searchParams.get('level') || 'All';

  const [schemes, setSchemes] = useState<IScheme[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [savedSchemeIds, setSavedSchemeIds] = useState<Set<string>>(new Set());
  const [statesSummary, setStatesSummary] = useState<{
    centralCount: number;
    totalCount: number;
    states: Array<{ state: string; count: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [selectedState, setSelectedState] = useState(initialState);
  const [benefitType, setBenefitType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('limit', '200');
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedLevel && selectedLevel !== 'All') params.append('schemeLevel', selectedLevel);
      if (selectedState && selectedState !== 'All') params.append('state', selectedState);
      if (benefitType && benefitType !== 'All') params.append('benefitType', benefitType);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await api.get(`/schemes?${params.toString()}`);
      if (res.data?.data) {
        setSchemes(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching schemes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/categories').then((res) => {
      if (res.data?.data) setCategories(res.data.data);
    });
    api.get('/schemes/states-summary').then((res) => {
      if (res.data?.data) setStatesSummary(res.data.data);
    }).catch(() => null);
  }, []);

  useEffect(() => {
    if (user) {
      api.get('/saved-schemes/ids')
        .then((res) => {
          if (Array.isArray(res.data?.data)) {
            setSavedSchemeIds(new Set(res.data.data));
          }
        })
        .catch(() => null);
    } else {
      setSavedSchemeIds(new Set());
    }
  }, [user]);

  const handleToggleSave = (schemeId: string, isSaved: boolean) => {
    setSavedSchemeIds((prev) => {
      const next = new Set(prev);
      if (isSaved) {
        next.add(schemeId);
      } else {
        next.delete(schemeId);
      }
      return next;
    });
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory, selectedLevel, selectedState, benefitType, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSchemes();
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedLevel('All');
    setSelectedState('All');
    setBenefitType('All');
    setSortBy('newest');
  };

  const totalSchemesCount = statesSummary?.totalCount || categories.reduce((acc, c) => acc + (c.schemeCount || 0), 0) || schemes.length;
  const stateSchemesCount = statesSummary?.states.reduce((acc, s) => acc + s.count, 0) || 50;
  const centralSchemesCount = statesSummary?.centralCount || 104;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron">Statutory Scheme Directory</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {totalSchemesCount} Official Schemes Live
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
          Explore Government Schemes
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
          Discover over 100 verified central and state welfare initiatives, direct subsidies, collateral-free credit lines, and health coverage schemes across India.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mb-8 space-y-4">
        {/* Scheme Authority Level Toggle (All / Central / State) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setSelectedLevel('All')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedLevel === 'All'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Schemes ({totalSchemesCount})
            </button>
            <button
              onClick={() => setSelectedLevel('Central')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                selectedLevel === 'Central'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🏛️ Central Govt</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600">
                {centralSchemesCount}
              </span>
            </button>
            <button
              onClick={() => setSelectedLevel('State')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                selectedLevel === 'State'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>📍 State Govt</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600">
                {stateSchemesCount}
              </span>
            </button>
          </div>

          {/* State Filter Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">State / UT:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-gov-saffron"
            >
              <option value="All">All India / Any State</option>
              {statesSummary?.states.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state} ({s.count} State Schemes)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* State Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            States:
          </span>
          <button
            onClick={() => setSelectedState('All')}
            className={`px-2.5 py-1 rounded-lg text-xs shrink-0 transition-colors ${
              selectedState === 'All'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All States
          </button>
          {statesSummary?.states.slice(0, 10).map((s) => (
            <button
              key={s.state}
              onClick={() => setSelectedState(s.state)}
              className={`px-2.5 py-1 rounded-lg text-xs shrink-0 transition-colors flex items-center gap-1 ${
                selectedState === s.state
                  ? 'bg-gov-saffron text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{s.state}</span>
              <span className="text-[10px] opacity-75 font-semibold">({s.count})</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, scheme name, or ministry..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-saffron"
            />
          </div>
          <Button type="submit" variant="primary" size="md">
            <span>Apply Search</span>
          </Button>
          {(search || selectedCategory || selectedState !== 'All' || selectedLevel !== 'All' || benefitType !== 'All') && (
            <Button type="button" variant="outline" size="md" onClick={resetFilters}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Reset</span>
            </Button>
          )}
        </form>

        {/* Categories Tab Scroll with Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
              !selectedCategory
                ? 'bg-gov-saffron text-white font-semibold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Categories ({totalSchemesCount})
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-gov-saffron text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat.name} {cat.schemeCount ? `(${cat.schemeCount})` : ''}
            </button>
          ))}
        </div>

        {/* Benefit type & Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Benefit Type:</span>
            <select
              value={benefitType}
              onChange={(e) => setBenefitType(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Benefits</option>
              <option value="Direct Benefit Transfer">Direct Benefit Transfer (DBT)</option>
              <option value="Subsidy">Subsidy</option>
              <option value="Loan / Credit">Loan / Credit</option>
              <option value="Insurance">Insurance</option>
              <option value="Skill Training">Skill Training</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="newest">Recently Added</option>
              <option value="popular">Most Viewed</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm animate-pulse">
          Loading government schemes...
        </div>
      ) : schemes.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
          <Landmark className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">No schemes found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or reset category filters to view available schemes.
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4">
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme._id}
              scheme={scheme}
              isSaved={savedSchemeIds.has(scheme._id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SchemesPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-500 text-sm animate-pulse">Loading schemes...</div>}>
      <SchemesContent />
    </Suspense>
  );
}
