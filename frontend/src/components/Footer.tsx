import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Biz<span className="text-blue-400">Sahayak</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              India's unified platform for businesses, startups, and MSMEs to discover central and state government schemes, capital subsidies, collateral-free loans, and tenders in one place.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Government Information</span>
            </div>
          </div>

          {/* Opportunities Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Explore Opportunities</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/schemes" className="text-slate-400 hover:text-white transition-colors">
                  MSME & Small Business Schemes
                </Link>
              </li>
              <li>
                <Link to="/schemes?schemeType=Subsidy" className="text-slate-400 hover:text-white transition-colors">
                  Capital Subsidies & Grants
                </Link>
              </li>
              <li>
                <Link to="/schemes?schemeType=Loan" className="text-slate-400 hover:text-white transition-colors">
                  Collateral-Free Credit Support
                </Link>
              </li>
              <li>
                <Link to="/tenders" className="text-slate-400 hover:text-white transition-colors">
                  Government Procurement Tenders
                </Link>
              </li>
              <li>
                <Link to="/tenders?state=Uttar%20Pradesh" className="text-slate-400 hover:text-white transition-colors">
                  State Tenders (Uttar Pradesh)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Platform Links</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register/business" className="text-slate-400 hover:text-white transition-colors">
                  Register Your MSME / Business
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Business User Login
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                  Admin System Login →
                </Link>
              </li>
              <li>
                <a
                  href="/swagger-ui.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Developer OpenAPI Docs
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer & Notice */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Important Notice</h3>
            <p className="text-slate-400 text-xs leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              BizSahayak provides aggregated information regarding government schemes and tenders. All official applications and submissions are completed directly through official ministry and government portals.
            </p>
          </div>
        </div>

        {/* Bottom copyright & Tricolor strip */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} BizSahayak. All rights reserved. Production-Quality Full Stack Portal.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Indian MSMEs & Businesses</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
