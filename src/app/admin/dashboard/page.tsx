'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  ShieldCheck,
  Users,
  FileText,
  Landmark,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [stats, setStats] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [citizens, setCitizens] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'applications' | 'citizens'>('applications');
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Approved');
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, appsRes, usersRes] = await Promise.all([
        api.get('/stats/admin'),
        api.get('/applications/all?limit=25'),
        api.get('/users/all?limit=25'),
      ]);

      if (statsRes.data?.data) setStats(statsRes.data.data);
      if (appsRes.data?.data) setApplications(appsRes.data.data);
      if (usersRes.data?.data) setCitizens(usersRes.data.data);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user, isLoading]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setProcessing(true);
    try {
      await api.patch(`/applications/${selectedApp._id}/status`, {
        status: newStatus,
        comment,
      });
      setSelectedApp(null);
      setComment('');
      fetchAdminData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to update application');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    try {
      await api.patch(`/users/${userId}/status`, { status: nextStatus });
      fetchAdminData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to update user status');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="py-24 text-center text-slate-500 text-sm animate-pulse">
        Loading administrative console...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-gov-gold flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Portal Administration Console
            </span>
            <h1 className="text-2xl font-black">{user?.name}</h1>
            <p className="text-xs text-slate-400">
              Department: {user?.department || 'National Informatics Centre'}
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={fetchAdminData} className="text-white border-slate-700 hover:bg-slate-800">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Schemes</span>
            <Landmark className="w-4 h-4 text-gov-saffron" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.totalSchemes || 0}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">Active in Catalog</span>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Applications</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.totalApplications || 0}
          </p>
          <span className="text-[11px] text-slate-400 font-semibold">All Time</span>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {stats?.pendingApplications || 0}
          </p>
          <span className="text-[11px] text-amber-500 font-semibold">Requires Action</span>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approval Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {stats?.approvalRate || 0}%
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">Sanctioned</span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'applications'
              ? 'bg-gov-saffron text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Applications Review Queue ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('citizens')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'citizens'
              ? 'bg-gov-saffron text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Registered Citizens ({citizens.length})
        </button>
      </div>

      {/* Tab Content: Applications */}
      {activeTab === 'applications' && (
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-3">Tracking #</th>
                  <th className="py-3 px-3">Citizen</th>
                  <th className="py-3 px-3">Scheme</th>
                  <th className="py-3 px-3">Submitted</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-mono font-bold text-gov-saffron">
                      #{app.applicationNumber}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{app.user?.name || 'Citizen'}</p>
                      <p className="text-[11px] text-slate-400">{app.user?.email || 'N/A'}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {app.scheme?.title || 'Scheme'}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
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
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApp(app);
                          setNewStatus(app.status);
                        }}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Citizens */}
      {activeTab === 'citizens' && (
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email & Phone</th>
                  <th className="py-3 px-3">State</th>
                  <th className="py-3 px-3">Occupation</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {citizens.map((citizen) => (
                  <tr key={citizen._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {citizen.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      <p>{citizen.email}</p>
                      <p className="text-[11px] text-slate-400">{citizen.phone}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{citizen.state || 'National'}</td>
                    <td className="py-3 px-3 text-slate-500">{citizen.occupation || 'Farmer'}</td>
                    <td className="py-3 px-3">
                      <Badge variant={citizen.status === 'Active' ? 'success' : 'danger'}>
                        {citizen.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant={citizen.status === 'Active' ? 'danger' : 'success'}
                        size="sm"
                        onClick={() => handleToggleUserStatus(citizen._id, citizen.status)}
                      >
                        {citizen.status === 'Active' ? 'Block' : 'Unblock'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-4">
            <div>
              <span className="text-[11px] font-bold text-gov-saffron uppercase">Application Verification</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                Review Application #{selectedApp.applicationNumber}
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2">
              <p>
                <span className="font-bold">Applicant:</span> {selectedApp.user?.name} ({selectedApp.user?.email})
              </p>
              <p>
                <span className="font-bold">Scheme:</span> {selectedApp.scheme?.title}
              </p>
              <p>
                <span className="font-bold">Bank Account:</span> {selectedApp.formData?.bankAccount || 'Verified'}
              </p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Change Verification Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Document Verification">Document Verification</option>
                  <option value="Approved">Approved (Sanction DBT)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Officer Remarks / Comments
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter remarks visible to the applicant..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedApp(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={processing}>
                  Save Decision
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
