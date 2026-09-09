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
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card flex flex-col justify-between p-5 hover:border-blue-300 hover:shadow-lg transition-all group">
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              {scheme.schemeType}
            </span>
            {scheme.featured && (
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
            <Badge status={scheme.status} />
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
              title={isSaved ? 'Remove Bookmark' : 'Save Scheme'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Title */}
        <Link to={`/schemes/${scheme.slug}`} className="block group-hover:text-blue-600 transition-colors">
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
            {scheme.title}
          </h3>
        </Link>

        {/* Department & State */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mb-3">
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
        <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {scheme.shortDescription || scheme.description}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {scheme.deadline ? `Deadline: ${new Date(scheme.deadline).toLocaleDateString()}` : 'Open Application'}
          </span>
        </div>

        <Link
          to={`/schemes/${scheme.slug}`}
          className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 text-xs"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
