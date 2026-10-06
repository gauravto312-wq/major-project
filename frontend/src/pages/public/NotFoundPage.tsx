import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home, Search, FileText, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-16 relative">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-gov-lg text-center space-y-6">
        {/* Emblem Badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#173B72] border-2 border-[#C89B3C]/50 flex items-center justify-center text-white font-bold mx-auto shadow-sm">
          <Building2 className="w-8 h-8 text-[#C89B3C]" />
        </div>

        {/* 404 Notice */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FEF7E6] text-[#B7791F] border border-[#F8D88E]">
            Error Code 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
            Document or Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6B7D] leading-relaxed max-w-md mx-auto">
            The requested digital record, scheme, or government portal resource does not exist or may have been relocated under updated portal guidelines.
          </p>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="btn-primary w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-[#173B72] hover:bg-[#2456A6]"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
          <Link
            to="/schemes"
            className="btn-secondary w-full sm:w-auto px-5 py-2.5 text-xs font-bold"
          >
            <FileText className="w-4 h-4 text-[#C89B3C]" /> Browse Schemes
          </Link>
          <Link
            to="/tenders"
            className="btn-secondary w-full sm:w-auto px-5 py-2.5 text-xs font-bold"
          >
            <Search className="w-4 h-4 text-[#C89B3C]" /> Search Tenders
          </Link>
        </div>

        {/* Footer Assist */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-[#5E6B7D]">
          <span>Need assistance? Contact National MSME Portal Support or review </span>
          <Link to="/" className="text-[#173B72] font-semibold hover:underline inline-flex items-center gap-0.5">
            Public Notifications <ArrowLeft className="w-3 h-3 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};
