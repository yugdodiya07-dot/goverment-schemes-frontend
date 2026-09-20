import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IScheme } from '../../types';
import { Badge } from '../ui/Badge';
import { ArrowRight, Landmark, IndianRupee, Bookmark, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

interface SchemeCardProps {
  scheme: IScheme;
  matchScore?: number;
  isSaved?: boolean;
  onToggleSave?: (schemeId: string, isSaved: boolean) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, matchScore, isSaved = false, onToggleSave }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/login');
      return;
    }

    setSaving(true);
    const nextState = !saved;
    setSaved(nextState);

    try {
      await api.post('/saved-schemes/toggle', { schemeId: scheme._id });
      if (onToggleSave) {
        onToggleSave(scheme._id, nextState);
      }
    } catch (err) {
      setSaved(saved); // rollback
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-200">
      {/* Top row: Ministry, Score & Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <Landmark className="w-3.5 h-3.5 text-gov-saffron shrink-0" />
            <span className="line-clamp-1">{scheme.ministry}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {matchScore !== undefined && (
              <Badge
                variant={matchScore >= 80 ? 'eligible' : matchScore >= 50 ? 'partial' : 'default'}
                className="shrink-0"
              >
                <Sparkles className="w-3 h-3" />
                {matchScore}% Match
              </Badge>
            )}

            <button
              onClick={handleBookmark}
              disabled={saving}
              title={saved ? 'Remove from Saved Watchlist' : 'Save Scheme'}
              aria-label="Save Scheme"
              className={`p-1.5 rounded-xl border transition-all ${
                saved
                  ? 'bg-amber-500/10 border-amber-500/30 text-gov-saffron hover:bg-amber-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-gov-saffron hover:border-gov-saffron/40'
              }`}
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-gov-saffron text-gov-saffron' : ''}`} />
              )}
            </button>
          </div>
        </div>

        {/* Scheme Level Badge & Category */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          {scheme.schemeLevel === 'State' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              📍 {scheme.state} State Scheme
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
              🏛️ Central Scheme (Pan-India)
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/schemes/${scheme.slug}`}>
          <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-gov-saffron transition-colors line-clamp-2 leading-snug">
            {scheme.title}
          </h3>
        </Link>

        {/* Short description */}
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {scheme.shortDescription}
        </p>
      </div>

      {/* Bottom section: Financial Benefit & Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-xl">
          <IndianRupee className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{scheme.financialBenefit}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-slate-400">
            {scheme.benefitType}
          </span>

          <Link
            href={`/schemes/${scheme.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gov-saffron hover:text-gov-saffronDark transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
