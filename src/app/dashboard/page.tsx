'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  User,
  FileText,
  Bookmark,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Landmark,
} from 'lucide-react';

export default function CitizenDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      Promise.all([api.get('/stats/citizen'), api.get('/applications/my')])
        .then(([statsRes, appsRes]) => {
          if (statsRes.data?.data) setStats(statsRes.data.data);
          if (appsRes.data?.data) setApplications(appsRes.data.data);
        })
        .catch((e) => console.error('Error fetching dashboard:', e))
        .finally(() => setLoading(false));
    }
  }, [user, isLoading]);

  if (isLoading || loading) {
    return (
      <div className="py-24 text-center text-slate-500 text-sm animate-pulse">
        Loading citizen welfare portal...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gov-saffron text-white flex items-center justify-center font-black text-xl shadow-glow">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-[11px] font-bold text-gov-saffron uppercase tracking-wider">Citizen Portal</span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Welcome, {user.name}</h1>
            <p className="text-xs text-slate-500">
              State: {user.state || 'National'} • Category: {user.category || 'General'} • Occupation: {user.occupation || 'Farmer'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href="/eligibility">
            <Button variant="primary" size="sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              <span>Check New Eligibility</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Applications</span>
            <FileText className="w-4 h-4 text-gov-saffron" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.appliedCount ?? applications.length}
          </p>
          <Link href="/applications" className="text-xs text-gov-saffron font-semibold hover:underline mt-2 inline-block">
            Track status & history →
          </Link>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Schemes</span>
            <Bookmark className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.savedCount ?? 0}
          </p>
          <Link href="/schemes" className="text-xs text-blue-500 font-semibold hover:underline mt-2 inline-block">
            Browse directory →
          </Link>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aadhaar Linked</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            Verified for DBT
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Direct bank transfer enabled
          </span>
        </div>
      </div>

      {/* Applications Overview */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Welfare Applications</h2>
            <p className="text-xs text-slate-500">Track verification stages and disbursement updates</p>
          </div>
          <Link href="/applications">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">You haven&apos;t submitted any scheme applications yet.</p>
            <Link href="/schemes" className="mt-3 inline-block">
              <Button variant="primary" size="sm">
                Explore & Apply
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {applications.slice(0, 5).map((app) => (
              <div key={app._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gov-saffron">#{app.applicationNumber}</span>
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
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {app.scheme?.title || 'Government Scheme'}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Applied on: {new Date(app.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>

                <Link href={`/schemes/${app.scheme?.slug || ''}`}>
                  <Button variant="outline" size="sm">
                    View Scheme
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
