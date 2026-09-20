import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Phone, Mail, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Portal Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-400/40">
                <Image src="/images/emblem.jpg" alt="National Emblem" fill className="object-cover" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                Gov<span className="text-gov-saffron">Smart</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Unified Single-Window Digital Welfare Delivery Platform under the Digital India Initiative. Developed for
              transparent, paperless access to central and state benefits.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>Certified 256-bit Encrypted Government Service</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Scheme Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/schemes?category=agriculture-rural-development" className="hover:text-gov-saffron">
                  Farmers & Agriculture (PM-KISAN)
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=health-wellness" className="hover:text-gov-saffron">
                  Ayushman Bharat (PM-JAY)
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=business-msme-entrepreneurship" className="hover:text-gov-saffron">
                  Mudra & MSME Credit
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=housing-urban-development" className="hover:text-gov-saffron">
                  Housing for All (PMAY)
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=women-child-development" className="hover:text-gov-saffron">
                  Women & Child Welfare
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/eligibility" className="hover:text-gov-saffron font-medium">
                  8-Factor Eligibility Calculator
                </Link>
              </li>
              <li>
                <Link href="/applications" className="hover:text-gov-saffron">
                  Track Application Status
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-gov-saffron">
                  Browse by Ministry
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gov-saffron">
                  Citizen Charter & Grievance
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: National Helpdesk */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              National Helpdesk
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gov-saffron" />
                <span>1800-111-999 (24x7 Toll-Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gov-saffron" />
                <span>support-govsmart@nic.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-gov-saffron" />
                <span>National Informatics Centre, New Delhi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tricolor strip & copyright */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 rounded-sm bg-gov-saffron" />
            <span className="w-3 h-1.5 rounded-sm bg-white border border-slate-300" />
            <span className="w-3 h-1.5 rounded-sm bg-gov-green" />
            <span>Designed for the Citizens of Bharat</span>
          </div>
          <p className="mt-2 sm:mt-0">© {new Date().getFullYear()} GovSmart Portal. Content owned by Government of India.</p>
        </div>
      </div>
    </footer>
  );
};
