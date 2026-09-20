'use client';

import React from 'react';
import { EligibilityWizard } from '../../components/schemes/EligibilityWizard';
import { Sparkles } from 'lucide-react';

export default function EligibilityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-gov-saffron text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Matching Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          8-Factor Weighted Eligibility Wizard
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Our algorithm cross-checks your profile against hundreds of government eligibility criteria rules including age,
          annual income limits, occupation restrictions, and state-specific quotas.
        </p>
      </div>

      <EligibilityWizard />
    </div>
  );
}
