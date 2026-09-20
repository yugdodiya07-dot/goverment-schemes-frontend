import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'GovSmart Portal 2.0 | National Single-Window Government Welfare Gateway',
  description:
    'Discover, check eligibility, and apply for central and state government schemes. Direct Benefit Transfer, PM-KISAN, Ayushman Bharat, PMAY, and Mudra loans in one unified citizen portal.',
  keywords: ['government schemes', 'pm-kisan', 'ayushman bharat', 'india welfare', 'dbt', 'subsidies'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-gov-saffron selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
