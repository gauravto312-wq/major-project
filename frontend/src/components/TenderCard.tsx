import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tender } from '../types';
import { Badge } from './Badge';
import { savedService } from '../services/savedService';
import { useAuth } from '../context/AuthContext';
import { Building2, Calendar, MapPin, Bookmark, Sparkles, ArrowRight, IndianRupee } from 'lucide-react';

interface TenderCardProps {
  tender: Tender;
  isSavedInitial?: boolean;
  onSaveToggle?: (saved: boolean) => void;
}

export const TenderCard: React.FC<TenderCardProps> = ({ tender, isSavedInitial = false, onSaveToggle }) => {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [loading, setLoading] = useState(false);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      if (isSaved) {
        await savedService.unsaveTender(tender.id);
        setIsSaved(false);
        if (onSaveToggle) onSaveToggle(false);
      } else {
        await savedService.saveTender(tender.id);
        setIsSaved(true);
        if (onSaveToggle) onSaveToggle(true);
      }
    } catch (err) {
      console.error('Failed to update tender bookmark:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Refer Tender Doc';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <article className="card flex flex-col justify-between p-5 bg-white/95 border border-slate-200 shadow-gov hover:border-[#6F9ED8] hover:shadow-gov-md transition-all group">
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-[#E5EEF9] text-[#173B72] border border-[#C7DBF2] text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
              {tender.tenderNumber}
            </span>
            {tender.featured && (
              <span className="bg-[#FEF7E6] text-[#B7791F] border border-[#F8D88E] text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C89B3C]" /> Featured
              </span>
            )}
            <Badge status={tender.status} />
          </div>

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={loading}
              aria-label={isSaved ? 'Remove Bookmark' : 'Save Tender'}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-amber-50 border-[#C89B3C] text-[#C89B3C]'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-[#173B72] hover:border-slate-300'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Save Tender'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#C89B3C]' : ''}`} />
            </button>
          )}
        </div>

        {/* Title */}
        <Link to={`/tenders/${tender.slug || tender.id}`} className="block group-hover:text-[#173B72] transition-colors">
          <h3 className="text-base font-bold text-[#172033] leading-snug line-clamp-2 mb-2 group-hover:text-[#173B72]">
            {tender.title}
          </h3>
        </Link>

        {/* Authority & State */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#5E6B7D] mb-3">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[160px]">{tender.organization}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{tender.state}</span>
          </span>
        </div>

        {/* Estimated Value */}
        <div className="bg-[#F5F7FA] border border-slate-200/80 rounded-xl p-3 mb-3 flex items-center justify-between text-xs">
          <span className="text-[#5E6B7D] font-medium">Estimated Value:</span>
          <span className="font-bold text-[#173B72] flex items-center font-mono text-sm">
            <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
            {formatCurrency(tender.estimatedValue)}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#5E6B7D] line-clamp-2 mb-4 leading-relaxed">
          {tender.description}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-[#5E6B7D]">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Due: {tender.closingDate ? new Date(tender.closingDate).toLocaleDateString() : 'Open / Ongoing'}</span>
        </div>

        <Link
          to={`/tenders/${tender.slug || tender.id}`}
          className="text-[#173B72] font-bold hover:text-[#2456A6] flex items-center gap-1 text-xs"
        >
          View Notice
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
};
