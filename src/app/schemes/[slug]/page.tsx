'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { IScheme } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Landmark,
  IndianRupee,
  Calendar,
  CheckCircle2,
  FileText,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Phone,
  ArrowRight,
  Send,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SchemeDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [scheme, setScheme] = useState<IScheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any | null>(null);

  // Form data for application
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [rationOrAadhaar, setRationOrAadhaar] = useState('');

  useEffect(() => {
    if (user) {
      setApplicantName(user.name);
      setApplicantPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (!slug) return;
    api
      .get(`/schemes/${slug}`)
      .then((res) => {
        if (res.data?.data) {
          setScheme(res.data.data);
        }
      })
      .catch((e) => console.error('Failed to load scheme details:', e))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!scheme) return;

    setSubmitting(true);
    try {
      const payload = {
        schemeId: scheme._id,
        formData: {
          applicantName,
          applicantPhone,
          bankAccount,
          ifscCode,
          rationOrAadhaar,
        },
        documents: [
          {
            documentName: 'Aadhaar e-KYC Verification',
            documentType: 'Digital Identity',
            fileUrl: 'https://uidai.gov.in/verified',
          },
        ],
        eligibilityScore: 100,
      };

      const res = await api.post('/applications/submit', payload);
      if (res.data?.data) {
        setSubmittedApp(res.data.data);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500 text-sm animate-pulse">
        Loading official scheme dossier...
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Scheme Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested scheme may have been archived or updated.</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/schemes')} className="mt-4">
          Return to Schemes
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          <Landmark className="w-4 h-4 text-gov-saffron" />
          <span>{scheme.ministry}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
          {scheme.title}
        </h1>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          {scheme.shortDescription}
        </p>

        {/* Financial Benefit Box & Apply Button */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved Benefit</p>
              <p className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-400">
                {scheme.financialBenefit}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="lg" onClick={() => setModalOpen(true)} className="shadow-glow">
              <span>Apply for Scheme</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid: Details & Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Full Description & Steps (8 cols) */}
        <div className="md:col-span-8 space-y-8">
          {/* Detailed Overview */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gov-saffron" />
              <span>Scheme Objectives & Overview</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {scheme.description}
            </p>
          </div>

          {/* Application Procedure Steps */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gov-green" />
              <span>How to Apply (Standard Procedure)</span>
            </h2>
            <div className="space-y-4">
              {scheme.applicationProcess?.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Eligibility Checklist & Documents (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          {/* Eligibility Checklist */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gov-saffron">
              Eligibility Parameters
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Age Bracket:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {scheme.eligibilityCriteria?.minAge} - {scheme.eligibilityCriteria?.maxAge} Years
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Gender:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {scheme.eligibilityCriteria?.gender || 'All Genders'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Max Income Ceiling:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  ₹{(scheme.eligibilityCriteria?.maxIncome || 0).toLocaleString('en-IN')} / Year
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Occupations:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {scheme.eligibilityCriteria?.eligibleOccupations?.join(', ') || 'All Occupations'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">State:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {scheme.eligibilityCriteria?.eligibleStates?.join(', ') || 'All India'}
                </span>
              </div>
            </div>
          </div>

          {/* Mandatory Documents */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Required Documents
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {scheme.requiredDocuments?.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron shrink-0 mt-1.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Helpline */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
            <p className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Official Scheme Helpline</span>
            </p>
            <p className="text-slate-700 dark:text-slate-300 font-semibold">{scheme.helplineNumber || '1800-111-999'}</p>
          </div>
        </div>
      </div>

      {/* Application Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => {
                setModalOpen(false);
                setSubmittedApp(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {!submittedApp ? (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase text-gov-saffron">Single-Window Application</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    Apply for {scheme.title}
                  </h3>
                </div>

                {!user && (
                  <div className="p-3 rounded-xl bg-orange-500/10 text-gov-saffron text-xs font-semibold">
                    Please log in or register before submitting your application.
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Beneficiary Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Aadhaar / Ration No.
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="XXXX-XXXX-XXXX"
                      value={rationOrAadhaar}
                      onChange={(e) => setRationOrAadhaar(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Bank Account Number (DBT)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Account No."
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Bank IFSC Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="SBIN0001234"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" className="w-full shadow-glow" isLoading={submitting}>
                    <Send className="w-4 h-4 mr-2" />
                    <span>Submit Official Application</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Received!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Tracking Number: <span className="font-bold text-gov-saffron">{submittedApp.applicationNumber}</span>
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Your application has been logged into the National Welfare Single-Window repository. You will receive SMS updates as your documents are reviewed.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => router.push('/applications')}>
                    Track in Dashboard
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
