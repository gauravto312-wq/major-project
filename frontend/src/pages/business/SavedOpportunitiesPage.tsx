import React, { useState, useEffect } from 'react';
import { savedService } from '../../services/savedService';
import { Scheme, Tender } from '../../types';
import { SchemeCard } from '../../components/SchemeCard';
import { TenderCard } from '../../components/TenderCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Bookmark, FileText, Layers } from 'lucide-react';

export const SavedOpportunitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SCHEMES' | 'TENDERS'>('SCHEMES');
  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>([]);
  const [savedTenders, setSavedTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = async () => {
    setLoading(true);
    try {
      const [schemesRes, tendersRes] = await Promise.all([
        savedService.getSavedSchemes(),
        savedService.getSavedTenders(),
      ]);

      if (schemesRes.success) setSavedSchemes(schemesRes.data);
      if (tendersRes.success) setSavedTenders(tendersRes.data);
    } catch (err) {
      console.error('Error loading saved items:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
          <Bookmark className="w-4 h-4" /> Bookmarked Opportunities
        </div>
        <h1 className="text-2xl font-black text-slate-900">Saved Schemes & Tenders</h1>
        <p className="text-xs text-slate-500">Quickly access government opportunities you have bookmarked for review or application.</p>
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
          Saved Schemes ({savedSchemes.length})
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
          Saved Tenders ({savedTenders.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your saved opportunities..." />
      ) : activeTab === 'SCHEMES' ? (
        savedSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                isSavedInitial={true}
                onSaveToggle={() => loadSavedItems()}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Saved Schemes"
            description="Click the bookmark icon on any scheme card to save it to your personal list."
          />
        )
      ) : savedTenders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedTenders.map((tender) => (
            <TenderCard
              key={tender.id}
              tender={tender}
              isSavedInitial={true}
              onSaveToggle={() => loadSavedItems()}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Saved Tenders"
          description="Click the bookmark icon on any tender card to save it to your personal list."
        />
      )}
    </div>
  );
};
