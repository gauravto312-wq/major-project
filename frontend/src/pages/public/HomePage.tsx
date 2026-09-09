import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { schemeService } from '../../services/schemeService';
import { tenderService } from '../../services/tenderService';
import { Scheme, Tender } from '../../types';
import { SchemeCard } from '../../components/SchemeCard';
import { TenderCard } from '../../components/TenderCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Search,
  Building2,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [featuredSchemes, setFeaturedSchemes] = useState<Scheme[]>([]);
  const [featuredTenders, setFeaturedTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [schemesRes, tendersRes] = await Promise.all([
        schemeService.getFeaturedSchemes(),
        tenderService.getFeaturedTenders(),
      ]);

      if (schemesRes.success) setFeaturedSchemes(schemesRes.data);
      if (tendersRes.success) setFeaturedTenders(tendersRes.data);
    } catch (err) {
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/schemes?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* HERO BANNER SECTION */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>India's Premier Government Opportunity Discovery Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Find Government <span className="text-amber-400">Schemes, Subsidies</span>, Loans & <span className="text-blue-300">Tenders</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-3xl mx-auto font-normal leading-relaxed">
            One unified portal for MSMEs, Startups, and Individual Businesses to discover central & state subsidies, collateral-free credit, and government procurement contracts.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-blue-200"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search schemes (e.g. MSME, Food Processing, Subsidy, Loan, Lucknow)..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto py-3 px-6 text-sm font-bold bg-blue-600 hover:bg-blue-700">
              Search Opportunities
            </button>
          </form>

          {/* Action Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-4 text-xs font-medium text-blue-200">
            <Link to="/schemes" className="hover:text-amber-300 transition-colors flex items-center gap-1">
              ✓ Explore Schemes
            </Link>
            <span>•</span>
            <Link to="/tenders" className="hover:text-amber-300 transition-colors flex items-center gap-1">
              ✓ Explore Tenders
            </Link>
            <span>•</span>
            <Link to="/register/business" className="text-amber-300 hover:underline font-bold flex items-center gap-1">
              ✓ Register MSME Profile
            </Link>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl font-black text-slate-900">Explore Opportunities by Industry & Category</h2>
          <p className="text-xs text-slate-500">Filter central and state schemes tailored to your enterprise sector</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/schemes?categoryId=1"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col items-center text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600">MSME & Small Business</h3>
              <p className="text-[11px] text-slate-500 mt-1">Capital subsidy & expansion grants</p>
            </div>
          </Link>

          <Link
            to="/schemes?schemeType=Subsidy"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col items-center text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600">Subsidies & Grants</h3>
              <p className="text-[11px] text-slate-500 mt-1">35% capital & margin money</p>
            </div>
          </Link>

          <Link
            to="/schemes?schemeType=Loan"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all group flex flex-col items-center text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600">Collateral-Free Credit</h3>
              <p className="text-[11px] text-slate-500 mt-1">CGTMSE & PMEGP loan guarantee</p>
            </div>
          </Link>

          <Link
            to="/tenders"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group flex flex-col items-center text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">Government Tenders</h3>
              <p className="text-[11px] text-slate-500 mt-1">Procurement & supply contracts</p>
            </div>
          </Link>
        </div>
      </section>

      {/* FEATURED SCHEMES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Central & State Highlights
            </div>
            <h2 className="text-2xl font-black text-slate-900">Featured Government Schemes</h2>
          </div>
          <Link to="/schemes" className="btn-secondary text-xs">
            View All Schemes
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching featured schemes..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </section>

      {/* BUSINESS MSME CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="inline-block px-3 py-1 bg-amber-400 text-slate-900 text-xs font-bold rounded-md">
              FOR REGISTERED BUSINESSES & MSMES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-snug">
              Get 95%+ Rule-Based Scheme Recommendations For Your Business
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Register your enterprise details (Industry, State, Investment & Turnover) to unlock customized opportunity matching and admin verification benefits.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-emerald-300 pt-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Transparent Rule-Based Match
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Verified Business Badge
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link to="/register/business" className="btn-primary py-3 px-6 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 text-center">
              Register Business Profile
            </Link>
            <Link to="/login" className="btn-secondary py-3 px-6 text-sm font-bold bg-white/10 hover:bg-white/20 text-white border-white/30 text-center">
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED TENDERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Verified Procurement
            </div>
            <h2 className="text-2xl font-black text-slate-900">Latest Government Tenders</h2>
          </div>
          <Link to="/tenders" className="btn-secondary text-xs">
            View All Tenders
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching latest tenders..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredTenders.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        )}
      </section>

      {/* HOW BIZSAHAYAK WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl font-black text-slate-900">How BizSahayak Empowers Your Business</h2>
          <p className="text-xs text-slate-500">From opportunity discovery to official government application</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center shadow-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">Search & Filter Opportunities</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore admin-verified central and state government schemes, subsidies, and tenders by industry, state, or investment range.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-lg flex items-center justify-center shadow-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">Complete Profile & Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Register your MSME business profile and upload required documents (GST/Udyam/PAN) for admin verification.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center shadow-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">Match & Apply on Official Portal</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive transparent rule-based recommendations, bookmark opportunities, and click directly to official government portals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
