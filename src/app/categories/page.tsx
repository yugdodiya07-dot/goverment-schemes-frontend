'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import { ICategory } from '../../types';
import {
  Wheat,
  HeartPulse,
  GraduationCap,
  Baby,
  Briefcase,
  Home,
  Users,
  Laptop,
  Building2,
  ArrowRight,
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/categories')
      .then((res) => {
        if (res.data?.data) setCategories(res.data.data);
      })
      .catch((e) => console.error('Failed to load categories:', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron">Welfare Portals</span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
          Browse by Scheme Category
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Categorized directories of central and state government welfare schemes and institutional subsidies.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm animate-pulse">
          Loading scheme categories...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon] || Building2;
            return (
              <Link
                key={cat._id}
                href={`/schemes?category=${cat.slug}`}
                className="group p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gov-saffron/50 hover:shadow-cardHover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-gov-saffron flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-gov-saffron transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">{cat.schemeCount || 1} Active Schemes</span>
                  <span className="inline-flex items-center gap-1 font-bold text-gov-saffron group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
