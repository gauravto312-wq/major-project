import React from 'react';
import { Link } from 'react-router-dom';
import { RecommendationResponse } from '../types';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: RecommendationResponse;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const { opportunityType, matchScore, matchReasons, scheme, tender } = recommendation;
  const isScheme = opportunityType === 'SCHEME' && scheme;
  const title = isScheme ? scheme.title : tender?.title;
  const slug = isScheme ? `/schemes/${scheme.slug}` : `/tenders/${tender?.slug}`;
  const department = isScheme ? scheme.department : tender?.organization;
  const state = isScheme ? scheme.state : tender?.state;

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500 text-white shadow-emerald-200';
    if (score >= 70) return 'bg-blue-600 text-white shadow-blue-200';
    return 'bg-amber-500 text-white shadow-amber-200';
  };

  return (
    <div className="card p-5 border-2 border-blue-100 hover:border-blue-300 transition-all flex flex-col justify-between relative bg-gradient-to-b from-white to-blue-50/20">
      <div>
        {/* Match Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {opportunityType} MATCH
          </span>

          <div
            className={`px-3 py-1 rounded-full text-xs font-black shadow-sm flex items-center gap-1 ${getScoreBadgeColor(
              matchScore
            )}`}
          >
            {matchScore}% Match
          </div>
        </div>

        {/* Title */}
        <Link to={slug} className="block group">
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>

        <div className="text-xs text-slate-500 mb-3">
          <span className="font-semibold text-slate-700">{department}</span> • <span>{state}</span>
        </div>

        {/* Why this matches section */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 mb-4 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Why this matches your business:
          </div>
          <ul className="space-y-1 text-xs text-slate-600">
            {matchReasons.map((reason, idx) => (
              <li key={idx} className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="text-emerald-600 font-bold">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">Verified Eligibility</span>
        <Link to={slug} className="btn-primary text-xs py-1.5 px-3">
          View Opportunity
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
