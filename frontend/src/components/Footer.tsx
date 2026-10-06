import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      className="relative text-[#DCE6F5] pt-12 pb-8 border-t-2 border-[#C89B3C] overflow-hidden"
      style={{
        background:
          "linear-gradient(rgba(23, 59, 114, 0.90), rgba(23, 59, 114, 0.95)), url('/assets/vidhan-bhawan.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.25)' }}
        >
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#173B72] border border-[#C89B3C]/50 flex items-center justify-center text-white font-bold shadow-sm">
                <Building2 className="w-5 h-5 text-[#C89B3C]" />
              </div>
              <span className="text-xl font-black text-[#FFFFFF] tracking-tight">
                Biz<span className="text-[#C89B3C]">Sahayak</span>
              </span>
            </div>
            <p className="text-[#DCE6F5] text-xs leading-relaxed font-normal">
              India's unified portal for businesses, startups, and MSMEs to discover central and state government schemes, capital subsidies, collateral-free loans, and procurement tenders.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/90 border border-emerald-500/50 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Government Information</span>
            </div>
          </div>

          {/* Opportunities Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C89B3C]"></span>
              Explore Opportunities
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/schemes" className="text-[#E7EEF8] hover:text-[#C89B3C] font-medium transition-colors">
                  MSME & Small Business Schemes
                </Link>
              </li>
              <li>
                <Link to="/schemes?schemeType=Subsidy" className="text-[#E7EEF8] hover:text-[#C89B3C] font-medium transition-colors">
                  Capital Subsidies & Grants
                </Link>
              </li>
              <li>
                <Link to="/schemes?schemeType=Loan" className="text-[#E7EEF8] hover:text-[#C89B3C] font-medium transition-colors">
                  Collateral-Free Credit Support
                </Link>
              </li>
              <li>
                <Link to="/tenders" className="text-[#E7EEF8] hover:text-[#C89B3C] font-medium transition-colors">
                  Government Procurement Tenders
                </Link>
              </li>
              <li>
                <Link to="/tenders?state=Uttar%20Pradesh" className="text-[#E7EEF8] hover:text-[#C89B3C] font-medium transition-colors">
                  State Tenders (Uttar Pradesh)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C89B3C]"></span>
              Platform Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register/business" className="text-[#E7EEF8] hover:text-[#C89B3C] font-medium transition-colors">
                  Register Your MSME / Business
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#E7EEF8] hover:text-[#C89B3C] font-medium transition-colors">
                  Business User Login
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-[#C89B3C] hover:text-[#FFFFFF] font-bold transition-colors">
                  Administrative System Access →
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer & Notice */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider">Official Portal Notice</h3>
            <div
              className="p-3.5 rounded-xl text-xs leading-relaxed font-normal"
              style={{
                backgroundColor: 'rgba(23, 59, 114, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <p className="text-[#FFFFFF]">
                BizSahayak provides aggregated discovery for official central and state government programs. Applications and formal tender bids are submitted directly through the designated official government departments.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Lucknow heritage note */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-[#DCE6F5] gap-4">
          <div>
            © {new Date().getFullYear()} BizSahayak. All rights reserved. Government Scheme & Tender Portal.
          </div>
          <div className="text-[#C89B3C] font-semibold">
            Vidhan Bhawan Visual Identity • Lucknow, Uttar Pradesh
          </div>
        </div>
      </div>
    </footer>
  );
};
