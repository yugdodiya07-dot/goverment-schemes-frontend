'use client';

import React, { useState } from 'react';
import api from '../../lib/api';
import { Button } from '../ui/Button';
import { SchemeCard } from './SchemeCard';
import { Badge } from '../ui/Badge';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INDIAN_STATES = [
  'National',
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Delhi',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

const OCCUPATIONS = [
  'Farmer',
  'Artisan',
  'Street Vendor',
  'Self-Employed',
  'Student',
  'Unemployed',
  'Employed / Salaried',
  'Business Owner',
];

const SOCIAL_CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'];

export const EligibilityWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const [formData, setFormData] = useState({
    age: 28,
    gender: 'Male',
    state: 'National',
    annualIncome: 300000,
    occupation: 'Farmer',
    category: 'General',
    disabilityStatus: false,
    specialStatus: [] as string[],
  });

  const toggleSpecialStatus = (status: string) => {
    setFormData((prev) => {
      const exists = prev.specialStatus.includes(status);
      return {
        ...prev,
        specialStatus: exists ? prev.specialStatus.filter((s) => s !== status) : [...prev.specialStatus, status],
      };
    });
  };

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/eligibility/check', formData);
      if (res.data?.data?.schemes) {
        setResults(res.data.data.schemes);
        setStep(4);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } catch (e) {
      console.error('Failed to calculate eligibility:', e);
    } finally {
      setLoading(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setResults(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-card p-6 sm:p-10 backdrop-blur-md">
      {/* Wizard Header & Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-500/10 text-gov-saffron flex items-center justify-center font-bold text-sm">
              {step}
            </span>
            <h2 className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
              {step === 1 && 'Personal Demographics'}
              {step === 2 && 'Socioeconomic Profile'}
              {step === 3 && 'Special Conditions & Trades'}
              {step === 4 && 'Your Personalized Eligibility Report'}
            </h2>
          </div>
          {step < 4 && (
            <span className="text-xs font-semibold text-slate-500">Step {step} of 3</span>
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gov-saffron to-amber-500 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Demographics */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Applicant Age: <span className="text-gov-saffron">{formData.age} Years</span>
            </label>
            <input
              type="range"
              min="1"
              max="95"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              className="w-full accent-gov-saffron cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 Year</span>
              <span>25 Years</span>
              <span>50 Years</span>
              <span>75+ Years</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Male', 'Female', 'Transgender'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      formData.gender === g
                        ? 'border-gov-saffron bg-orange-500/10 text-gov-saffron'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                State of Residence
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setStep(2)}>
              <span>Next: Socioeconomic Details</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Socioeconomic Profile */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Annual Household Income: <span className="text-emerald-600 font-bold">₹{formData.annualIncome.toLocaleString('en-IN')}</span>
            </label>
            <input
              type="range"
              min="0"
              max="2500000"
              step="25000"
              value={formData.annualIncome}
              onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>BPL (₹0)</span>
              <span>₹5 Lakh</span>
              <span>₹10 Lakh</span>
              <span>₹25 Lakh+</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Current Primary Occupation
              </label>
              <select
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
              >
                {OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Social Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
              >
                {SOCIAL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back</span>
            </Button>
            <Button onClick={() => setStep(3)}>
              <span>Next: Special Conditions</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Special Conditions */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Disability Checkbox */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Person with Disability (Divyangjan)</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Do you possess a valid UDID / 40%+ disability certificate?</p>
            </div>
            <input
              type="checkbox"
              checked={formData.disabilityStatus}
              onChange={(e) => setFormData({ ...formData, disabilityStatus: e.target.checked })}
              className="w-5 h-5 rounded text-gov-saffron focus:ring-gov-saffron"
            />
          </div>

          {/* Special Status Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select all special attributes that apply to your household:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Farmer', 'Artisan', 'Girl Child', 'Single Mother', 'Ex-Serviceman', 'Craftsperson'].map((tag) => {
                const selected = formData.specialStatus.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleSpecialStatus(tag)}
                    className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                      selected
                        ? 'border-gov-saffron bg-orange-500/10 text-gov-saffron'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    + {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back</span>
            </Button>
            <Button onClick={handleEvaluate} isLoading={loading} variant="primary" className="shadow-glow">
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>Calculate 8-Factor Eligibility</span>
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Results & Radar breakdown */}
      {step === 4 && results && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Summary Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                AI Eligibility Match Complete
              </span>
              <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white mt-1">
                You Qualify for {results.filter((s) => s.isEligible).length} Schemes!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Based on your age ({formData.age}), annual income (₹{formData.annualIncome.toLocaleString('en-IN')}), and occupation ({formData.occupation}).
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetWizard}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Recalculate</span>
            </Button>
          </div>

          {/* Schemes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item) => (
              <div key={item.scheme._id} className="relative">
                <SchemeCard scheme={item.scheme} matchScore={item.score} />
                {/* Expandable Breakdown Drawer */}
                <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Criteria Match Log:</span>
                  <ul className="mt-1 space-y-1 text-[11px]">
                    {item.matchedRules.slice(0, 2).map((rule: string, i: number) => (
                      <li key={i} className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span className="line-clamp-1">{rule}</span>
                      </li>
                    ))}
                    {item.unmatchedRules.slice(0, 1).map((rule: string, i: number) => (
                      <li key={i} className="flex items-center gap-1 text-slate-400">
                        <XCircle className="w-3 h-3 shrink-0 text-slate-400" />
                        <span className="line-clamp-1">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
