'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

const STATUS_STEPS = ['Submitted', 'Under Review', 'Document Verification', 'Approved'];

export default function ApplicationsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      api
        .get('/applications/my')
        .then((res) => {
          if (res.data?.data) setApplications(res.data.data);
        })
        .catch((e) => console.error('Failed to load applications:', e))
        .finally(() => setLoading(false));
    }
  }, [user, isLoading]);

  if (isLoading || loading) {
    return (
      <div className="py-24 text-center text-slate-500 text-sm animate-pulse">
        Fetching citizen application records...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron">Single Window System</span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
          Track Welfare Applications
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Real-time tracking of verification, document auditing, and direct benefit transfer sanctions.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">No Submitted Applications</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Find government welfare schemes tailored to your socioeconomic profile and submit an application.
          </p>
          <Link href="/schemes" className="mt-4 inline-block">
            <Button variant="primary" size="sm">
              Browse Schemes
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const currentStepIdx = STATUS_STEPS.indexOf(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div
                key={app._id}
                className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card space-y-6"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gov-saffron">
                        Tracking ID: #{app.applicationNumber}
                      </span>
                      <Badge
                        variant={
                          app.status === 'Approved'
                            ? 'success'
                            : app.status === 'Rejected'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {app.scheme?.title || 'Government Scheme'}
                    </h3>
                  </div>

                  <span className="text-xs text-slate-400">
                    Submitted: {new Date(app.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>

                {/* Progress Visualizer */}
                {!isRejected ? (
                  <div className="relative pt-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;
                        return (
                          <div key={step} className="flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                                isDone
                                  ? 'bg-emerald-500 text-white shadow-sm'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                              } ${isCurrent ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[11px] font-semibold leading-tight ${
                                isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-start gap-3 text-xs">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-800 dark:text-rose-400">Application Disapproved</p>
                      <p className="text-rose-700 dark:text-rose-300 mt-0.5">
                        {app.adminRemarks || 'Eligibility documentation did not satisfy ministry criteria guidelines.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Admin comments if available */}
                {app.adminRemarks && !isRejected && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider block mb-1">
                      Verification Officer Notes:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">{app.adminRemarks}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
