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
    if (score >= 85) return 'bg-[#1B8354] text-white';
    if (score >= 70) return 'bg-[#2456A6] text-white';
    return 'bg-[#B7791F] text-white';
  };

  return (
    <article className="card p-5 border border-slate-200 shadow-gov hover:border-[#6F9ED8] hover:shadow-gov-md transition-all flex flex-col justify-between relative bg-white/95 group">
      <div>
        {/* Match Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#E5EEF9] text-[#173B72] border border-[#C7DBF2] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C89B3C]" />
            {opportunityType} MATCH
          </span>

          <div
            className={`px-3 py-1 rounded-md text-xs font-bold shadow-xs flex items-center gap-1 ${getScoreBadgeColor(
              matchScore
            )}`}
          >
            {matchScore}% Match
          </div>
        </div>

        {/* Title */}
        <Link to={slug} className="block group">
          <h3 className="text-base font-bold text-[#172033] leading-snug line-clamp-2 mb-2 group-hover:text-[#173B72] transition-colors">
            {title}
          </h3>
        </Link>

        <div className="text-xs text-[#5E6B7D] mb-3">
          <span className="font-semibold text-[#172033]">{department}</span> • <span>{state}</span>
        </div>

        {/* Why this matches section */}
        <div className="bg-[#F5F7FA] p-3 rounded-xl border border-slate-200/80 mb-4">
          <div className="text-[11px] font-bold text-[#173B72] uppercase tracking-wider mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1B8354]" />
            Why this matches your enterprise:
          </div>
          <ul className="space-y-1 text-xs text-[#5E6B7D]">
            {matchReasons && matchReasons.length > 0 ? (
              matchReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#C89B3C] font-bold">•</span>
                  <span>{reason}</span>
                </li>
              ))
            ) : (
              <li className="italic text-slate-400">Matched on industry sector & eligibility parameters</li>
            )}
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <Link
          to={slug}
          className="text-[#173B72] font-bold hover:text-[#2456A6] flex items-center gap-1 text-xs"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {isScheme && scheme.slug && (
          <Link
            to={`/schemes/${scheme.slug}/assistant`}
            className="bg-[#173B72] hover:bg-[#2456A6] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
          >
            <Sparkles className="w-3 h-3 text-[#C89B3C]" /> Launch Assistant
          </Link>
        )}
      </div>
    </article>
  );
};
