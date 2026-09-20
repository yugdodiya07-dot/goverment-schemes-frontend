'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { ISavedScheme } from '../../types';
import { Button } from '../../components/ui/Button';
import {
  Bookmark,
  BookmarkX,
  Search,
  Filter,
  ArrowRight,
  Landmark,
  IndianRupee,
  Calendar,
  FileEdit,
  Trash2,
  ExternalLink,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';

export default function SavedSchemesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [savedList, setSavedList] = useState<ISavedScheme[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Central' | 'State'>('All');

  // Note editing modal
  const [editingNoteSchemeId, setEditingNoteSchemeId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Status feedback toast/banner
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchSavedSchemes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/saved-schemes');
      if (res.data?.data) {
        setSavedList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load saved schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/saved');
      return;
    }
    if (user) {
      fetchSavedSchemes();
    }
  }, [user, isLoading]);

  const handleRemove = async (schemeId: string, schemeTitle: string) => {
    try {
      // Optimistic removal
      setSavedList((prev) => prev.filter((item) => item.scheme?._id !== schemeId));
      await api.delete(`/saved-schemes/${schemeId}`);
      setActionMessage(`"${schemeTitle}" removed from your saved watchlist.`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      console.error('Failed to remove saved scheme:', err);
      fetchSavedSchemes(); // rollback on error
    }
  };

  const handleOpenNoteModal = (item: ISavedScheme) => {
    setEditingNoteSchemeId(item.scheme._id);
    setNoteContent(item.notes || '');
  };

  const handleSaveNote = async () => {
    if (!editingNoteSchemeId) return;
    setSavingNote(true);
    try {
      await api.patch(`/saved-schemes/${editingNoteSchemeId}/notes`, { notes: noteContent });
      setSavedList((prev) =>
        prev.map((item) =>
          item.scheme._id === editingNoteSchemeId ? { ...item, notes: noteContent } : item
        )
      );
      setEditingNoteSchemeId(null);
      setActionMessage('Personal notes updated successfully.');
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err) {
      console.error('Failed to update note:', err);
    } finally {
      setSavingNote(false);
    }
  };

  // Distinct categories among saved schemes
  const savedCategories = useMemo(() => {
    const set = new Set<string>();
    savedList.forEach((item) => {
      const cat = typeof item.scheme?.category === 'object' ? item.scheme.category?.name : null;
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }, [savedList]);

  // Filtered saved schemes
  const filteredList = useMemo(() => {
    return savedList.filter((item) => {
      const scheme = item.scheme;
      if (!scheme) return false;

      // Search match
      const matchesSearch =
        !search.trim() ||
        scheme.title.toLowerCase().includes(search.toLowerCase()) ||
        scheme.ministry.toLowerCase().includes(search.toLowerCase()) ||
        scheme.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()));

      // Category match
      const categoryName = typeof scheme.category === 'object' ? scheme.category?.name : '';
      const matchesCategory = selectedCategory === 'All' || categoryName === selectedCategory;

      // Scheme Level match
      const matchesLevel =
        selectedLevel === 'All' ||
        (selectedLevel === 'Central' && scheme.schemeLevel !== 'State') ||
        (selectedLevel === 'State' && scheme.schemeLevel === 'State');

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [savedList, search, selectedCategory, selectedLevel]);

  if (isLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-slate-500 text-sm animate-pulse">
        Loading your saved government schemes...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast alert banner */}
      {actionMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gov-saffron mb-1">
            <Bookmark className="w-3.5 h-3.5 fill-gov-saffron text-gov-saffron" />
            <span>Citizen Watchlist & Shortlist</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            My Saved Schemes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Manage welfare schemes and subsidies you shortlisted for your household. Track document preparation and apply when ready.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-gov-saffron font-bold text-xs">
            {savedList.length} Schemes Shortlisted
          </span>
          <Link href="/schemes">
            <Button variant="outline" size="sm">
              <span>Explore More</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {savedList.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-gov-saffron flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 fill-gov-saffron/20" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            Your Saved Watchlist is Empty
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            You haven't bookmarked any government schemes yet. Shortlist schemes to compare financial benefits, review document checklists, and prepare your applications.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link href="/schemes">
              <Button variant="primary" size="md">
                <Search className="w-4 h-4 mr-1.5" />
                <span>Browse 150+ Schemes</span>
              </Button>
            </Link>
            <Link href="/eligibility">
              <Button variant="outline" size="md">
                <Sparkles className="w-4 h-4 mr-1.5 text-gov-saffron" />
                <span>Check My Eligibility</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Filter & Search Bar */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mb-8 space-y-4">
            {/* Top row: Search input & Level buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search saved schemes by title, ministry, or your personal notes..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-saffron"
                />
              </div>

              {/* Level Segmented Filter */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold shrink-0">
                <button
                  onClick={() => setSelectedLevel('All')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedLevel === 'All'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({savedList.length})
                </button>
                <button
                  onClick={() => setSelectedLevel('Central')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedLevel === 'Central'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Central
                </button>
                <button
                  onClick={() => setSelectedLevel('State')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedLevel === 'State'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  State
                </button>
              </div>

              {(search || selectedCategory !== 'All' || selectedLevel !== 'All') && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('All');
                    setSelectedLevel('All');
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  <span>Reset</span>
                </Button>
              )}
            </div>

            {/* Category Filter Pills */}
            {savedCategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Category:
                </span>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-gov-saffron text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  All Categories
                </button>
                {savedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                      selectedCategory === cat
                        ? 'bg-gov-saffron text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid of Saved Schemes */}
          {filteredList.length === 0 ? (
            <div className="py-14 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                No matching saved schemes found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting your search terms or reset the filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((item) => {
                const scheme = item.scheme;
                return (
                  <div
                    key={item._id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card hover:shadow-cardHover transition-all duration-200"
                  >
                    <div>
                      {/* Top row: Ministry & Remove button */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          <Landmark className="w-3.5 h-3.5 text-gov-saffron shrink-0" />
                          <span className="line-clamp-1">{scheme.ministry}</span>
                        </div>

                        <button
                          onClick={() => handleRemove(scheme._id, scheme.title)}
                          title="Remove from saved watchlist"
                          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* State / Central Authority Badge */}
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        {scheme.schemeLevel === 'State' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            📍 {scheme.state} State Scheme
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                            🏛️ Central Scheme
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">
                          {scheme.benefitType}
                        </span>
                      </div>

                      {/* Scheme Title */}
                      <Link href={`/schemes/${scheme.slug}`}>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-gov-saffron transition-colors line-clamp-2 leading-snug">
                          {scheme.title}
                        </h3>
                      </Link>

                      {/* Short description */}
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {scheme.shortDescription}
                      </p>

                      {/* Personal Notes Section */}
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <FileEdit className="w-3 h-3 text-gov-saffron" />
                            <span>My Application Note</span>
                          </span>
                          <button
                            onClick={() => handleOpenNoteModal(item)}
                            className="text-gov-saffron hover:underline font-semibold text-[10px]"
                          >
                            {item.notes ? 'Edit' : '+ Add Note'}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2 italic">
                          {item.notes || 'No notes added yet. Click "+ Add Note" to note required documents or deadlines.'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom row: Financial benefit & Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-xl">
                        <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                        <span className="line-clamp-1">{scheme.financialBenefit}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={`/schemes/${scheme.slug}`}
                          className="text-xs font-semibold text-gov-saffron hover:text-gov-saffronDark transition-colors inline-flex items-center gap-1"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <Link href={`/schemes/${scheme.slug}`}>
                          <Button variant="primary" size="sm">
                            <span>Apply Now</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Note Editing Modal */}
      {editingNoteSchemeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-gov-saffron" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Personal Application Notes
                </h3>
              </div>
              <button
                onClick={() => setEditingNoteSchemeId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Jot down pending documents, application deadlines, CSC kiosk visits, or notes for your family.
            </p>

            <textarea
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="e.g. Need to collect land 7/12 extract and bank passbook photocopy before applying at Taluka office..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-saffron resize-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditingNoteSchemeId(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveNote} disabled={savingNote}>
                {savingNote ? 'Saving...' : 'Save Note'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
