import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  const { isAuthenticated, user } = useAuth();
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
      {/* ========================================================
          HERO BANNER SECTION with Vidhan Bhawan Visual Identity
          ======================================================== */}
      <section
        className="relative text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-[#173B72]"
        style={{
          backgroundImage: "url('/assets/vidhan-bhawan.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Soft, desaturated architectural wash overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#173B72]/90 via-[#173B72]/85 to-[#0F264A]/95 backdrop-blur-[1px]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C89B3C]/40 text-xs font-semibold text-[#F3E8D0] shadow-sm">
            <Sparkles className="w-4 h-4 text-[#C89B3C]" />
            <span>India's Premier Government Opportunity Discovery Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            Find Government <span className="text-[#C89B3C]">Schemes, Subsidies</span>, Loans & <span className="text-[#6F9ED8]">Tenders</span>
          </h1>

          <p className="text-base sm:text-lg text-[#F5F7FA]/90 max-w-3xl mx-auto font-normal leading-relaxed">
            One unified portal for MSMEs, Startups, and Individual Businesses to discover central & state subsidies, collateral-free credit, and government procurement contracts.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-gov-lg flex flex-col sm:flex-row items-center gap-2 border border-slate-200"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                aria-label="Search schemes and subsidies"
                placeholder="Search what you need (e.g. restaurant, women, startup, solar, loan)..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent text-[#172033] placeholder-[#5E6B7D]/60 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto py-3 px-6 text-sm font-bold bg-[#173B72] hover:bg-[#2456A6] text-white border border-[#C89B3C]/40"
            >
              Search Opportunities
            </button>
          </form>

          {/* Action Pills */}
          <div className="flex flex-wrap justify-center items-center gap-3 pt-4 text-xs font-medium text-[#C7DBF2]">
            <Link to="/schemes" className="hover:text-[#F3E8D0] transition-colors flex items-center gap-1 font-semibold">
              <span className="text-[#C89B3C]">✓</span> Explore Schemes
            </Link>
            <span>•</span>
            <Link to="/tenders" className="hover:text-[#F3E8D0] transition-colors flex items-center gap-1 font-semibold">
              <span className="text-[#C89B3C]">✓</span> Explore Tenders
            </Link>
            {(!isAuthenticated || !user) && (
              <>
                <span>•</span>
                <Link to="/register/business" className="text-[#C89B3C] hover:text-[#F3E8D0] hover:underline font-bold flex items-center gap-1">
                  <span>✓</span> Register MSME Profile
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          POPULAR CATEGORIES GRID
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <div className="text-xs font-bold text-[#173B72] uppercase tracking-wider">
            Sectoral Classification
          </div>
          <h2 className="text-2xl font-black text-[#172033]">Explore Opportunities by Industry & Category</h2>
          <p className="text-xs text-[#5E6B7D]">Filter central and state schemes tailored to your enterprise sector</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/schemes?categoryId=1"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-gov hover:border-[#2456A6] hover:shadow-gov-md transition-all group flex flex-col items-center text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E5EEF9] text-[#173B72] flex items-center justify-center group-hover:bg-[#173B72] group-hover:text-white transition-all shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#173B72]">MSME & Small Business</h3>
              <p className="text-[11px] text-[#5E6B7D] mt-1">Capital subsidy & expansion grants</p>
            </div>
          </Link>

          <Link
            to="/schemes?schemeType=Subsidy"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-gov hover:border-[#1B8354] hover:shadow-gov-md transition-all group flex flex-col items-center text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-[#EBF7F0] text-[#1B8354] flex items-center justify-center group-hover:bg-[#1B8354] group-hover:text-white transition-all shadow-xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#1B8354]">Subsidies & Grants</h3>
              <p className="text-[11px] text-[#5E6B7D] mt-1">35% capital & margin money</p>
            </div>
          </Link>

          <Link
            to="/schemes?schemeType=Loan"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-gov hover:border-[#B7791F] hover:shadow-gov-md transition-all group flex flex-col items-center text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FEF7E6] text-[#B7791F] flex items-center justify-center group-hover:bg-[#B7791F] group-hover:text-white transition-all shadow-xs">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#B7791F]">Collateral-Free Credit</h3>
              <p className="text-[11px] text-[#5E6B7D] mt-1">CGTMSE & PMEGP loan guarantee</p>
            </div>
          </Link>

          <Link
            to="/tenders"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-gov hover:border-[#173B72] hover:shadow-gov-md transition-all group flex flex-col items-center text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E5EEF9] text-[#173B72] flex items-center justify-center group-hover:bg-[#173B72] group-hover:text-white transition-all shadow-xs">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#173B72]">Government Tenders</h3>
              <p className="text-[11px] text-[#5E6B7D] mt-1">Procurement & supply contracts</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================
          FEATURED SCHEMES SECTION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#173B72] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#C89B3C]" />
              Central & State Highlights
            </div>
            <h2 className="text-2xl font-black text-[#172033]">Featured Government Schemes</h2>
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

      {/* ========================================================
          BUSINESS MSME CALLOUT BANNER (Shown ONLY when logged-out or new user)
          ======================================================== */}
      {(!isAuthenticated || !user) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#173B72] via-[#2456A6] to-[#0F264A] rounded-3xl p-8 sm:p-12 text-white shadow-gov-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-[#C89B3C]/30">
            <div className="space-y-4 max-w-xl">
              <span className="inline-block px-3 py-1 bg-[#C89B3C] text-[#172033] text-xs font-extrabold rounded-md shadow-xs">
                FOR REGISTERED BUSINESSES & MSMES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-snug">
                Get 95%+ Rule-Based Scheme Recommendations For Your Business
              </h2>
              <p className="text-xs sm:text-sm text-[#F5F7FA]/90 leading-relaxed">
                Register your enterprise details (Industry, State, Investment & Turnover) to unlock customized opportunity matching and admin verification benefits.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#D8C39A] pt-2">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#1B8354]" /> Transparent Rule-Based Match
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#1B8354]" /> Verified Business Badge
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                to="/register/business"
                className="btn-accent py-3 px-6 text-xs font-bold text-center"
              >
                Register Business Profile
              </Link>
              <Link
                to="/login"
                className="btn-secondary py-3 px-6 text-xs font-bold bg-white/10 hover:bg-white/20 text-white border-white/30 text-center"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          FEATURED TENDERS SECTION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#173B72] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-[#173B72]" />
              Verified Procurement
            </div>
            <h2 className="text-2xl font-black text-[#172033]">Latest Government Tenders</h2>
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

      {/* ========================================================
          HOW BIZSAHAYAK WORKS
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-3xl border border-slate-200 shadow-gov">
        <div className="text-center space-y-2 mb-12">
          <div className="text-xs font-bold text-[#173B72] uppercase tracking-wider">
            Operational Blueprint
          </div>
          <h2 className="text-2xl font-black text-[#172033]">How BizSahayak Empowers Your Business</h2>
          <p className="text-xs text-[#5E6B7D]">From opportunity discovery to official government application</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E5EEF9] text-[#173B72] font-black text-lg flex items-center justify-center shadow-xs border border-[#C7DBF2]">
              1
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Search & Filter Opportunities</h3>
            <p className="text-xs text-[#5E6B7D] leading-relaxed">
              Explore admin-verified central and state government schemes, subsidies, and tenders by industry, state, or investment range.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F3E8D0] text-[#173B72] font-black text-lg flex items-center justify-center shadow-xs border border-[#D8C39A]">
              2
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Complete Profile & Verification</h3>
            <p className="text-xs text-[#5E6B7D] leading-relaxed">
              Register your MSME business profile and upload required documents (GST/Udyam/PAN) for admin verification.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF7F0] text-[#1B8354] font-black text-lg flex items-center justify-center shadow-xs border border-[#A3D9BD]">
              3
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Match & Apply on Official Portal</h3>
            <p className="text-xs text-[#5E6B7D] leading-relaxed">
              Receive transparent rule-based recommendations, bookmark opportunities, and click directly to official government portals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
