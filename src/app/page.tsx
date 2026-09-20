'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '../lib/api';
import { IScheme, ICategory } from '../types';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { Button } from '../components/ui/Button';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Users,
  Award,
  CheckCircle,
  Wheat,
  HeartPulse,
  GraduationCap,
  Baby,
  Briefcase,
  Home,
  Laptop,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  Wheat,
  HeartPulse,
  GraduationCap,
  Baby,
  Briefcase,
  Home,
  Users,
  Laptop,
};

export default function HomePage() {
  const [trendingSchemes, setTrendingSchemes] = useState<IScheme[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schemesRes, catRes] = await Promise.all([
          api.get('/schemes?limit=6&sortBy=popular'),
          api.get('/categories'),
        ]);
        if (schemesRes.data?.data) {
          setTrendingSchemes(schemesRes.data.data);
        }
        if (catRes.data?.data) {
          setCategories(catRes.data.data);
        }
      } catch (e) {
        console.error('Failed to load home data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Hero Copy & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-gov-saffron text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Citizen Welfare Portal</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Unlock Government Benefits You Are <span className="text-gov-saffron">Entitled To.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                GovSmart uses an intelligent 8-Factor eligibility engine to instantly match your household with hundreds of
                central & state welfare schemes, scholarships, and financial subsidies.
              </p>

              {/* Quick Search Box */}
              <div className="p-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-card flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1 flex items-center pl-3">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by scheme name, ministry, or benefit (e.g. Kisan, Mudra)..."
                    className="w-full py-2.5 px-3 text-xs sm:text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <Link href={`/schemes?search=${encodeURIComponent(searchQuery)}`}>
                  <Button variant="primary" className="w-full sm:w-auto h-11 px-6 shadow-glow">
                    <span>Search Schemes</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Popular Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Popular:</span>
                {['PM-KISAN', 'Ayushman Bharat', 'Mudra Loans', 'PMAY Housing', 'Skill India'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/schemes?search=${encodeURIComponent(tag)}`}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-500/10 hover:text-gov-saffron transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Col: High-Definition AI Civic Artwork */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <Image
                  src="/images/hero.jpg"
                  alt="Citizens of India accessing digital government welfare"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-slate-700/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-gov-saffron uppercase tracking-wider">
                        100% Paperless & Verified
                      </p>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        Direct Benefit Transfer (DBT) to Aadhaar
                      </p>
                    </div>
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key National Numbers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="text-center sm:text-left border-r border-slate-800 last:border-none pr-4">
            <p className="text-2xl sm:text-3xl font-black text-gov-saffron">₹12.5L+ Cr</p>
            <p className="text-xs text-slate-400 mt-1">DBT Welfare Disbursed</p>
          </div>
          <div className="text-center sm:text-left border-r border-slate-800 last:border-none pr-4">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">850+</p>
            <p className="text-xs text-slate-400 mt-1">Central & State Schemes</p>
          </div>
          <div className="text-center sm:text-left border-r border-slate-800 last:border-none pr-4">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">55+ Crore</p>
            <p className="text-xs text-slate-400 mt-1">Ayushman Beneficiaries</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-black text-white">99.8%</p>
            <p className="text-xs text-slate-400 mt-1">Direct Bank Delivery</p>
          </div>
        </div>
      </section>

      {/* 3. Scheme Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron">Welfare Sectors</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Browse Schemes by Category
            </h2>
          </div>
          <Link href="/categories" className="text-xs font-semibold text-gov-saffron hover:underline flex items-center gap-1">
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.icon] || Building;
            return (
              <Link
                key={cat._id}
                href={`/schemes?category=${cat.slug}`}
                className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gov-saffron/40 hover:shadow-cardHover transition-all flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-gov-saffron flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-gov-saffron transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {cat.schemeCount || 1} Schemes Available
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Trending & Essential Schemes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              National Priority
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Flagship Government Schemes
            </h2>
          </div>
          <Link href="/schemes" className="text-xs font-semibold text-gov-saffron hover:underline flex items-center gap-1">
            <span>Explore All Schemes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingSchemes.map((scheme) => (
            <SchemeCard key={scheme._id} scheme={scheme} />
          ))}
        </div>
      </section>

      {/* 5. 8-Factor Eligibility CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gov-navy to-slate-900 text-white p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              Smart Citizen Matcher
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Not sure which schemes you qualify for?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Take 60 seconds with our 8-Factor Weighted Eligibility Wizard. We evaluate your age, income, state, and
              occupation to recommend 100% matched benefits.
            </p>
            <div className="pt-2">
              <Link href="/eligibility">
                <Button variant="primary" size="lg" className="shadow-glow">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Launch Eligibility Wizard</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
