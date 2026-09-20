'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.data) {
        const { user, token } = res.data.data;
        login(token, user);
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (role: 'admin' | 'citizen') => {
    if (role === 'admin') {
      setEmail('admin@gmail.com');
      setPassword('Admin@2026');
    } else {
      setEmail('citizen@gmail.com');
      setPassword('Citizen@2026');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden border border-amber-400/40">
            <Image src="/images/emblem.jpg" alt="National Emblem" fill className="object-cover" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Portal Sign In</h1>
          <p className="text-xs text-slate-500">Access citizen benefits or administrative control panel</p>
        </div>

        {/* Demo fill pills for testing convenience */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Test Quick Login:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold text-gov-saffron hover:bg-orange-500/10 transition-colors text-[11px]"
            >
              👑 Admin Demo
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('citizen')}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors text-[11px]"
            >
              👤 Citizen Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-saffron focus:outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full shadow-glow" isLoading={loading}>
            <span>Sign In to GovSmart</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          <span>Don&apos;t have an account yet? </span>
          <Link href="/register" className="font-bold text-gov-saffron hover:underline">
            Register as Citizen
          </Link>
        </div>
      </div>
    </div>
  );
}
