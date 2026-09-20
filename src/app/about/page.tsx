'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, CheckCircle2, Lock, Cpu, Globe, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron">Citizen First Governance</span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          About GovSmart Portal 2.0
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          National Single-Window Digital Welfare Delivery Gateway engineered to eliminate bureaucratic friction and
          connect every citizen of India with their rightful welfare benefits.
        </p>
      </div>

      {/* Grid: 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-gov-saffron flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">8-Factor Matching Engine</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Eliminates guess-work by evaluating age brackets, income ceilings, occupation restrictions, and district-level
            quotas with 99.9% precision.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Zero Leakage Direct Transfers</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Direct integration with Aadhaar Payment Bridge System (APBS) and Public Financial Management System (PFMS) ensures
            subsidies reach citizen accounts without middlemen.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Universal Accessibility</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Engineered according to Indian Government Web Guidelines (GIGW) with full keyboard accessibility, dark mode,
            and mobile-first responsiveness.
          </p>
        </div>
      </div>

      {/* Security & Compliance */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>National Informatics Centre Certified</span>
        </div>
        <h2 className="text-2xl font-black">Data Privacy & Sovereignty Commitment</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Citizen records uploaded on the GovSmart Portal are protected by end-to-end encryption complying with the
          Digital Personal Data Protection Act (DPDP). No citizen data is shared with third-party advertising vendors or
          unauthorized entities.
        </p>
      </div>
    </div>
  );
}
