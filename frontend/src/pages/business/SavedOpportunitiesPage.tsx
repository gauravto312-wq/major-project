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
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-gov space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
          <Bookmark className="w-4 h-4 text-[#C89B3C]" /> Bookmarked Opportunities
        </div>
        <h1 className="text-2xl font-black text-[#172033]">Saved Schemes & Tenders</h1>
        <p className="text-xs text-[#5E6B7D]">Quickly access government opportunities you have bookmarked for review or application.</p>
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
          Saved Schemes ({savedSchemes.length})
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
          Saved Tenders ({savedTenders.length})
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching your saved bookmarks..." />
      ) : activeTab === 'SCHEMES' ? (
        savedSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                isSavedInitial={true}
                onSaveToggle={(saved) => {
                  if (!saved) {
                    setSavedSchemes((prev) => prev.filter((s) => s.id !== scheme.id));
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Schemes Saved Yet"
            description="Browse central and state government schemes and click the bookmark icon to save them for later."
          />
        )
      ) : savedTenders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedTenders.map((tender) => (
            <TenderCard
              key={tender.id}
              tender={tender}
              isSavedInitial={true}
              onSaveToggle={(saved) => {
                if (!saved) {
                  setSavedTenders((prev) => prev.filter((t) => t.id !== tender.id));
                }
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Tenders Saved Yet"
          description="Browse active procurement notices and bookmark tenders relevant to your supply capabilities."
        />
      )}
    </div>
  );
};
