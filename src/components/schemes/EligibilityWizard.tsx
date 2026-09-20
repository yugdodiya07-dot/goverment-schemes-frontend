'use client';

import React, { useState, useMemo } from 'react';
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
  AlertTriangle,
  Info,
  RotateCcw,
  ShieldAlert,
  IndianRupee,
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
  { id: 'Student', label: 'Student', adultOnly: false },
  { id: 'Farmer', label: 'Farmer', adultOnly: true },
  { id: 'Artisan', label: 'Artisan / Craftsperson', adultOnly: true },
  { id: 'Street Vendor', label: 'Street Vendor', adultOnly: true },
  { id: 'Self-Employed', label: 'Self-Employed', adultOnly: true },
  { id: 'Business Owner', label: 'Business Owner / MSME', adultOnly: true },
  { id: 'Employed / Salaried', label: 'Employed / Salaried', adultOnly: true },
  { id: 'Unemployed', label: 'Unemployed', adultOnly: false },
];

const SOCIAL_CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'];

export const EligibilityWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [serverWarnings, setServerWarnings] = useState<string[]>([]);
  const [resultsTab, setResultsTab] = useState<'eligible' | 'ineligible'>('eligible');

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

  const eligibleSchemes = useMemo(() => {
    return results ? results.filter((s) => s.isEligible) : [];
  }, [results]);

  const ineligibleSchemes = useMemo(() => {
    return results ? results.filter((s) => !s.isEligible) : [];
  }, [results]);

  // Real-time civic statutory validations & warning rules
  const validation = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const notices: string[] = [];

    // Rule 0: Minimum & Maximum Age Validation
    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum <= 0) {
      errors.push(
        'Statutory Requirement: Applicant age must be at least 1 completed year (valid range: 1–115 yrs). Neonatal or infant healthcare schemes (< 1 yr) require applying through the mother/guardian profile.'
      );
    } else if (ageNum > 115) {
      errors.push(
        'Invalid Age: Applicant age exceeds valid civic registry limit (115 years). Please enter a verified age between 1 and 115.'
      );
    }

    // Rule 1: Child Labour Act (1986)
    if (ageNum > 0 && ageNum < 14) {
      const selectedOcc = OCCUPATIONS.find((o) => o.id === formData.occupation);
      if (selectedOcc?.adultOnly) {
        errors.push(
          'Statutory Violation: Under the Child Labour (Prohibition & Regulation) Act, applicants under 14 cannot be registered under commercial trades. Please select "Student".'
        );
      }
    }

    // Rule 2: EWS 103rd Constitutional Amendment limit
    if (formData.category === 'EWS' && formData.annualIncome > 800000) {
      errors.push(
        `EWS Income Ceiling Exceeded: Central Government guidelines mandate gross family income to be strictly under ₹8,00,000 for EWS classification (Current: ₹${formData.annualIncome.toLocaleString('en-IN')}).`
      );
    }

    // Rule 3: Gender vs Female-only criteria
    if (formData.gender === 'Male') {
      if (formData.specialStatus.includes('Girl Child') || formData.specialStatus.includes('Single Mother')) {
        errors.push(
          'Incompatible Criteria: "Girl Child" / "Single Mother" welfare benefits (e.g. Sukanya Samriddhi, PMMVY) are strictly reserved for Female beneficiaries.'
        );
      }
    }

    // Warning 1: Minor commercial credit restriction
    if (formData.age < 18 && (formData.occupation === 'Business Owner' || formData.occupation === 'Self-Employed')) {
      warnings.push(
        'Minor Credit Advisory: Applicants under 18 cannot independently execute institutional loan agreements (e.g., Mudra / PMEGP) without an adult parent or legal guardian co-applicant.'
      );
    }

    // Warning 2: High income vs BPL welfare
    if (formData.annualIncome > 1000000) {
      warnings.push(
        'High Income Notice: Income exceeds ₹10,00,000. Low-income direct subsidies (Ayushman Bharat, BPL Ration, PMAY) will be disqualified; credit guarantee and educational merit schemes remain accessible.'
      );
    }

    // Notice 1: Senior citizen benefits
    if (formData.age >= 60) {
      notices.push(
        'Senior Citizen Entitlement: You qualify for National Social Assistance, Senior Health Coverage, and Atal Pension / Senior citizen concessions.'
      );
    }

    // Notice 2: Divyangjan quota
    if (formData.disabilityStatus) {
      notices.push(
        'Divyangjan Quota: Ensure possession of a valid UDID card or 40%+ medical board benchmark disability certificate to claim dedicated reservations.'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      notices,
    };
  }, [formData]);

  const toggleSpecialStatus = (status: string) => {
    // If Male and trying to select Girl Child or Single Mother, prevent selection
    if (formData.gender === 'Male' && (status === 'Girl Child' || status === 'Single Mother')) {
      return;
    }

    setFormData((prev) => {
      const exists = prev.specialStatus.includes(status);
      return {
        ...prev,
        specialStatus: exists ? prev.specialStatus.filter((s) => s !== status) : [...prev.specialStatus, status],
      };
    });
  };

  const handleEvaluate = async () => {
    if (!validation.isValid) return;

    setLoading(true);
    try {
      const res = await api.post('/eligibility/check', formData);
      if (res.data?.data?.schemes) {
        setResults(res.data.data.schemes);
        setServerWarnings(res.data.data.warnings || []);
        const eligibleCount = res.data.data.eligibleCount ?? res.data.data.schemes.filter((s: any) => s.isEligible).length;
        setResultsTab(eligibleCount > 0 ? 'eligible' : 'ineligible');
        setStep(4);
        if (eligibleCount > 0) {
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
        }
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to calculate eligibility');
    } finally {
      setLoading(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setResults(null);
    setServerWarnings([]);
    setResultsTab('eligible');
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-card p-6 sm:p-10 backdrop-blur-md">
      {/* Wizard Header & Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-orange-500/10 text-gov-saffron flex items-center justify-center font-bold text-sm">
              {step}
            </span>
            <h2 className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
              {step === 1 && 'Personal Demographics'}
              {step === 2 && 'Socioeconomic Profile'}
              {step === 3 && 'Special Conditions & Verified Trades'}
              {step === 4 && 'Your Statutory Eligibility Report'}
            </h2>
          </div>
          {step < 4 && (
            <span className="text-xs font-semibold text-slate-500">Step {step} of 3</span>
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gov-saffron via-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Dynamic Real-Time Warnings & Alerts Bar */}
      {step < 4 && (validation.errors.length > 0 || validation.warnings.length > 0 || validation.notices.length > 0) && (
        <div className="mb-6 space-y-2 animate-in fade-in duration-150">
          {/* Blocking Errors */}
          {validation.errors.map((err, idx) => (
            <div
              key={`err-${idx}`}
              className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-xs"
            >
              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-rose-700 dark:text-rose-300">
                <span className="font-bold">Statutory Conflict: </span>
                <span>{err}</span>
              </div>
            </div>
          ))}

          {/* Warnings */}
          {validation.warnings.map((warn, idx) => (
            <div
              key={`warn-${idx}`}
              className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-start gap-2.5 text-xs"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-amber-800 dark:text-amber-300">
                <span className="font-bold">Advisory: </span>
                <span>{warn}</span>
              </div>
            </div>
          ))}

          {/* Helpful Notices */}
          {validation.notices.map((notice, idx) => (
            <div
              key={`not-${idx}`}
              className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-start gap-2.5 text-xs text-blue-700 dark:text-blue-300"
            >
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>{notice}</span>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Demographics */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Age Slider + Number Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Applicant Age (in Completed Years) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="115"
                  value={formData.age}
                  onChange={(e) => {
                    const rawVal = e.target.value;
                    const val = rawVal === '' ? 0 : Number(rawVal);
                    setFormData({
                      ...formData,
                      age: val,
                      // auto-reset occupation if minor
                      occupation: val < 14 ? 'Student' : formData.occupation,
                    });
                  }}
                  className={`w-20 py-1.5 px-2 text-center text-xs font-bold rounded-lg border transition-all ${
                    formData.age <= 0 || formData.age > 115
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-600 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-gov-saffron focus:ring-gov-saffron'
                  } focus:outline-none focus:ring-2`}
                />
                <span className="text-xs text-slate-500 font-semibold">Years</span>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="95"
              value={Math.max(1, formData.age)}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFormData({
                  ...formData,
                  age: val,
                  occupation: val < 14 ? 'Student' : formData.occupation,
                });
              }}
              className="w-full accent-gov-saffron cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Child (1-13)</span>
              <span>Youth (14-35)</span>
              <span>Middle Age (36-59)</span>
              <span>Senior Citizen (60+)</span>
            </div>

            {/* Inline Age Error Banner if 0 or negative */}
            {(formData.age <= 0 || isNaN(formData.age)) && (
              <div className="mt-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in duration-150">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Invalid Age:</strong> Age cannot be 0. Enter at least 1 completed year to proceed with scheme eligibility.
                </span>
              </div>
            )}
            {formData.age > 115 && (
              <div className="mt-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in duration-150">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Invalid Age:</strong> Applicant age exceeds valid civic registry ceiling (115 yrs).
                </span>
              </div>
            )}
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
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        gender: g,
                        // Clean female-only tags if switching to Male
                        specialStatus:
                          g === 'Male'
                            ? prev.specialStatus.filter((s) => s !== 'Girl Child' && s !== 'Single Mother')
                            : prev.specialStatus,
                      }));
                    }}
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
                State / UT of Domicile
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
            <Button
              onClick={() => setStep(2)}
              disabled={!validation.isValid || !formData.age || Number(formData.age) <= 0 || Number(formData.age) > 115}
            >
              <span>Next: Socioeconomic Details</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Socioeconomic Profile */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Income Slider + Number Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Annual Household Income (Gross INR)
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  max="5000000"
                  step="10000"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-28 py-1 px-2 text-right text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

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
              <span>BPL / Low Income (₹0)</span>
              <span>₹2.5L (Tax Exemption)</span>
              <span>₹8.0L (EWS Ceiling)</span>
              <span>₹25L+</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Primary Trade / Occupation
              </label>
              <select
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
              >
                {OCCUPATIONS.map((o) => {
                  const isMinorRestricted = formData.age < 14 && o.adultOnly;
                  return (
                    <option key={o.id} value={o.id} disabled={isMinorRestricted}>
                      {o.label} {isMinorRestricted ? '(Restricted for age <14)' : ''}
                    </option>
                  );
                })}
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
                    {c} {c === 'EWS' ? '(Income < ₹8L required)' : ''}
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
            <Button onClick={() => setStep(3)} disabled={!validation.isValid}>
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
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Holds a valid UDID card or 40%+ permanent medical disability certificate.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.disabilityStatus}
              onChange={(e) => setFormData({ ...formData, disabilityStatus: e.target.checked })}
              className="w-5 h-5 rounded text-gov-saffron focus:ring-gov-saffron cursor-pointer"
            />
          </div>

          {/* Special Status Tags with smart guards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select special attributes applicable to your household:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { tag: 'Farmer', femaleOnly: false },
                { tag: 'Artisan', femaleOnly: false },
                { tag: 'Girl Child', femaleOnly: true },
                { tag: 'Single Mother', femaleOnly: true },
                { tag: 'Ex-Serviceman', femaleOnly: false },
                { tag: 'Craftsperson', femaleOnly: false },
              ].map(({ tag, femaleOnly }) => {
                const selected = formData.specialStatus.includes(tag);
                const isGenderIncompatible = formData.gender === 'Male' && femaleOnly;

                return (
                  <button
                    key={tag}
                    type="button"
                    disabled={isGenderIncompatible}
                    onClick={() => toggleSpecialStatus(tag)}
                    className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                      isGenderIncompatible
                        ? 'opacity-40 border-dashed border-slate-300 dark:border-slate-700 cursor-not-allowed bg-slate-100 dark:bg-slate-800/20'
                        : selected
                        ? 'border-gov-saffron bg-orange-500/10 text-gov-saffron'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>+ {tag}</span>
                      {selected && <CheckCircle2 className="w-3.5 h-3.5 text-gov-saffron" />}
                    </div>
                    {femaleOnly && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {isGenderIncompatible ? 'Female only' : 'Reserved female benefit'}
                      </span>
                    )}
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
            <Button
              onClick={handleEvaluate}
              isLoading={loading}
              disabled={!validation.isValid}
              variant="primary"
              className="shadow-glow"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>Calculate 8-Factor Eligibility</span>
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Results & Detailed Breakdown */}
      {step === 4 && results && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Summary Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Statutory Assessment Complete
              </span>
              <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white mt-1">
                You Qualify for {eligibleSchemes.length} Welfare Scheme{eligibleSchemes.length === 1 ? '' : 's'}!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Evaluated against: Age ({formData.age} yrs), Income (₹{formData.annualIncome.toLocaleString('en-IN')}), Category ({formData.category}), and Occupation ({formData.occupation}).
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetWizard}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Recalculate Profile</span>
            </Button>
          </div>

          {/* Server Advisories / Warnings */}
          {serverWarnings.length > 0 && (
            <div className="space-y-2">
              {serverWarnings.map((warn, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          {/* Results Tab Navigation: Eligible vs Disqualified */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-fit">
              <button
                type="button"
                onClick={() => setResultsTab('eligible')}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  resultsTab === 'eligible'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Directly Eligible Schemes ({eligibleSchemes.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setResultsTab('ineligible')}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  resultsTab === 'ineligible'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Disqualified / Other Schemes ({ineligibleSchemes.length})</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-medium">
              Showing {resultsTab === 'eligible' ? eligibleSchemes.length : ineligibleSchemes.length} of {results.length} total schemes
            </span>
          </div>

          {/* TAB 1: Directly Eligible Schemes */}
          {resultsTab === 'eligible' && (
            <div>
              {eligibleSchemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eligibleSchemes.map((item) => (
                    <div key={item.scheme._id} className="relative flex flex-col">
                      <SchemeCard scheme={item.scheme} matchScore={item.score} />
                      <div className="mt-2.5 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-bold text-[11px] text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Statutory Match Confirmed (100%)
                          </span>
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                            Fully Qualified
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-[11px]">
                          {item.matchedRules.map((rule: string, i: number) => (
                            <li key={i} className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span className="line-clamp-1">{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3">
                    <Info className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    No Direct Scheme Matches for this Exact Profile
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1.5">
                    Your combination of age ({formData.age} yrs), occupation ({formData.occupation}), and income (₹{formData.annualIncome.toLocaleString('en-IN')}) did not qualify for direct central schemes.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setResultsTab('ineligible')}
                      className="text-xs font-bold text-gov-saffron hover:underline"
                    >
                      View Disqualified Schemes & Audit Reasons →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Disqualified / Ineligible Schemes */}
          {resultsTab === 'ineligible' && (
            <div>
              {ineligibleSchemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ineligibleSchemes.map((item) => (
                    <div key={item.scheme._id} className="relative flex flex-col opacity-90 hover:opacity-100 transition-opacity">
                      <SchemeCard scheme={item.scheme} matchScore={item.score} />
                      <div className="mt-2.5 p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-bold text-[11px] text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Statutory Disqualification Audit
                          </span>
                          <span className="text-[10px] bg-rose-100 dark:bg-rose-900/80 text-rose-700 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                            Disqualified
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-[11px]">
                          {(item.disqualifications?.length ? item.disqualifications : item.unmatchedRules || []).map((reason: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5 text-rose-800 dark:text-rose-300">
                              <span className="text-rose-500 font-bold shrink-0">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-6 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/30">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Congratulations! You Qualify for All Evaluated Schemes!
                  </h4>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
