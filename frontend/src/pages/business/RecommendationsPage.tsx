import React, { useState, useEffect } from 'react';
import { recommendationService } from '../../services/recommendationService';
import { RecommendationResponse } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { RecommendationCard } from '../../components/RecommendationCard';
import { EmptyState } from '../../components/EmptyState';
import { Sparkles, FileText, Layers } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SCHEMES' | 'TENDERS'>('SCHEMES');
  const [schemeRecs, setSchemeRecs] = useState<RecommendationResponse[]>([]);
  const [tenderRecs, setTenderRecs] = useState<RecommendationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const [schemesRes, tendersRes] = await Promise.all([
        recommendationService.getRecommendedSchemes(),
        recommendationService.getRecommendedTenders(),
      ]);

      if (schemesRes.success) setSchemeRecs(schemesRes.data);
      if (tendersRes.success) setTenderRecs(tendersRes.data);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentRecs = activeTab === 'SCHEMES' ? schemeRecs : tenderRecs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner with Vidhan Bhawan Visual Identity */}
      <div
        className="relative rounded-3xl p-8 text-white shadow-gov-lg overflow-hidden bg-[#173B72]"
        style={{
          backgroundImage: "url('/assets/vidhan-bhawan.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#173B72]/95 via-[#173B72]/90 to-[#0F264A]/95 backdrop-blur-[1px]"></div>

        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#F3E8D0] border border-[#C89B3C]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
            <span>Transparent Rule-Based Opportunity Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Personalized Business Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F7FA]/90 leading-relaxed">
            Our rule-based recommendation system analyzes your verified business profile (Industry, Entity Type, Location, Investment & Turnover) to compute transparent match percentage scores and eligibility rationale.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('SCHEMES')}
          className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'SCHEMES'
              ? 'border-[#173B72] text-[#173B72]'
              : 'border-transparent text-[#5E6B7D] hover:text-[#172033]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#C89B3C]" />
          Recommended Schemes ({schemeRecs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TENDERS')}
          className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'TENDERS'
              ? 'border-[#173B72] text-[#173B72]'
              : 'border-transparent text-[#5E6B7D] hover:text-[#172033]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#C89B3C]" />
          Recommended Tenders ({tenderRecs.length})
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner message="Calculating transparent recommendation match scores..." />
      ) : currentRecs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentRecs.map((rec, idx) => (
            <RecommendationCard key={idx} recommendation={rec} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No ${activeTab === 'SCHEMES' ? 'Schemes' : 'Tenders'} Recommended Yet`}
          description="Make sure your Business Profile is completed with Industry and State details to calculate matching opportunities."
        />
      )}
    </div>
  );
};
