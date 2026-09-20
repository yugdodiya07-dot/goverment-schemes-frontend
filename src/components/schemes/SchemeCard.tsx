'use client';

import React from 'react';
import Link from 'next/link';
import { IScheme } from '../../types';
import { Badge } from '../ui/Badge';
import { ArrowRight, Landmark, IndianRupee, Bookmark, Sparkles } from 'lucide-react';

interface SchemeCardProps {
  scheme: IScheme;
  matchScore?: number;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, matchScore }) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-200">
      {/* Top row: Ministry & Score */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <Landmark className="w-3.5 h-3.5 text-gov-saffron shrink-0" />
            <span className="line-clamp-1">{scheme.ministry}</span>
          </div>

          {matchScore !== undefined && (
            <Badge
              variant={matchScore >= 80 ? 'eligible' : matchScore >= 50 ? 'partial' : 'default'}
              className="shrink-0"
            >
              <Sparkles className="w-3 h-3" />
              {matchScore}% Match
            </Badge>
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
