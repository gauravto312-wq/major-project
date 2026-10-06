import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scheme } from '../types';
import { Badge } from './Badge';
import { savedService } from '../services/savedService';
import { useAuth } from '../context/AuthContext';
import { Building2, Calendar, MapPin, Bookmark, Sparkles, ArrowRight } from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  isSavedInitial?: boolean;
  onSaveToggle?: (saved: boolean) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, isSavedInitial = false, onSaveToggle }) => {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [loading, setLoading] = useState(false);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      if (isSaved) {
        await savedService.unsaveScheme(scheme.id);
        setIsSaved(false);
        if (onSaveToggle) onSaveToggle(false);
      } else {
        await savedService.saveScheme(scheme.id);
        setIsSaved(true);
        if (onSaveToggle) onSaveToggle(true);
      }
    } catch (err) {
      console.error('Failed to update bookmark status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="card flex flex-col justify-between p-5 bg-white/95 border border-slate-200 shadow-gov hover:border-[#6F9ED8] hover:shadow-gov-md transition-all group">
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-[#E5EEF9] text-[#173B72] border border-[#C7DBF2] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              {scheme.schemeType || 'Scheme'}
            </span>
            {scheme.featured && (
              <span className="bg-[#FEF7E6] text-[#B7791F] border border-[#F8D88E] text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C89B3C]" /> Featured
              </span>
            )}
            <Badge status={scheme.status} />
          </div>

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={loading}
              aria-label={isSaved ? 'Remove Bookmark' : 'Save Scheme'}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-amber-50 border-[#C89B3C] text-[#C89B3C]'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-[#173B72] hover:border-slate-300'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Save Scheme'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#C89B3C]' : ''}`} />
            </button>
          )}
        </div>

        {/* Title */}
        <Link to={`/schemes/${scheme.slug}`} className="block group-hover:text-[#173B72] transition-colors">
          <h3 className="text-base font-bold text-[#172033] leading-snug line-clamp-2 mb-2 group-hover:text-[#173B72]">
            {scheme.title}
          </h3>
        </Link>

        {/* Department & State */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#5E6B7D] mb-3">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[160px]">{scheme.department}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{scheme.state}</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#5E6B7D] line-clamp-3 mb-4 leading-relaxed">
          {scheme.shortDescription || scheme.description}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <Link
          to={`/schemes/${scheme.slug}`}
          className="text-[#173B72] font-bold hover:text-[#2456A6] flex items-center gap-1 text-xs"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {scheme.slug && (
          <Link
            to={`/schemes/${scheme.slug}/assistant`}
            className="bg-[#173B72] hover:bg-[#2456A6] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
          >
            <Sparkles className="w-3 h-3 text-[#C89B3C]" /> Assistant
          </Link>
        )}
      </div>
    </article>
  );
};
