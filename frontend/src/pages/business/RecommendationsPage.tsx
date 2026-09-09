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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-lg space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Transparent Rule-Based Opportunity Engine
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">Personalized Business Recommendations</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Our rule-based recommendation system analyzes your verified business profile (Industry, Entity Type, Location, Investment & Turnover) to compute transparent match percentage scores and eligibility rationale.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('SCHEMES')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'SCHEMES'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Recommended Schemes ({schemeRecs.length})
        </button>

        <button
          onClick={() => setActiveTab('TENDERS')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'TENDERS'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
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
