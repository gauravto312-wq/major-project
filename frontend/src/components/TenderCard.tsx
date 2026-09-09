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
      // silent
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
    <div className="card flex flex-col justify-between p-5 hover:border-indigo-300 hover:shadow-lg transition-all group">
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
              {tender.tenderNumber}
            </span>
            {tender.featured && (
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
            <Badge status={tender.status} />
          </div>

          {isAuthenticated && (
            <button
              onClick={handleSaveClick}
              disabled={loading}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Save Tender'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Title */}
        <Link to={`/tenders/${tender.slug}`} className="block group-hover:text-indigo-600 transition-colors">
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
            {tender.title}
          </h3>
        </Link>

        {/* Organization & Location */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[160px]">{tender.organization}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{tender.state}</span>
          </span>
        </div>

        {/* Estimated Tender Value */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 mb-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Est. Value</span>
          <span className="text-sm font-bold text-slate-900 flex items-center">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600 mr-0.5" />
            {formatCurrency(tender.estimatedValue)}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {tender.description}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {tender.closingDate ? `Closing: ${new Date(tender.closingDate).toLocaleDateString()}` : 'Active Procurement'}
          </span>
        </div>

        <Link
          to={`/tenders/${tender.slug}`}
          className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 text-xs"
        >
          View Tender
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
