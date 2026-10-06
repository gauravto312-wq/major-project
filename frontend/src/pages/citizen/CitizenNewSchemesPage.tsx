import React, { useEffect, useState } from 'react';
import { citizenService } from '../../services/citizenService';
import { savedService } from '../../services/savedService';
import { Scheme } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { SchemeCard } from '../../components/SchemeCard';
import { Pagination } from '../../components/Pagination';
import { Zap, Search } from 'lucide-react';

export const CitizenNewSchemesPage: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [savedSchemeIds, setSavedSchemeIds] = useState<number[]>([]);

  const fetchNewSchemes = async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await citizenService.getNewSchemes(pageNum, 12);
      if (res.success && res.data) {
        setSchemes(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      } else {
        setError(res.message || 'Failed to load new schemes');
      }
      const savedRes = await savedService.getSavedSchemes();
      if (savedRes.success && savedRes.data) {
        setSavedSchemeIds(savedRes.data.map((s) => s.id));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching newly published schemes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewSchemes(page);
  }, [page]);

  const handleToggleSaveScheme = async (schemeId: number) => {
    const isSaved = savedSchemeIds.includes(schemeId);
    try {
      if (isSaved) {
        await savedService.unsaveScheme(schemeId);
        setSavedSchemeIds((prev) => prev.filter((id) => id !== schemeId));
      } else {
        await savedService.saveScheme(schemeId);
        setSavedSchemeIds((prev) => [...prev, schemeId]);
      }
    } catch (err) {
      console.error('Error toggling scheme save state:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">✨</span>
            New Schemes & Latest Opportunities
          </h1>
          <p className="text-[#5E6B7D] text-sm mt-1">
            Explore recently published Central and State government assistance, subsidies, and welfare programs.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-600 shadow-sm flex items-center gap-2 self-start md:self-auto">
          <span className="font-bold text-[#173B72]">{totalElements}</span> Schemes Published
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Grid of Schemes */}
      {loading ? (
        <LoadingSpinner message="Loading newly published schemes..." />
      ) : schemes.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
          <Zap className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900 mt-2">No New Schemes Available</h3>
          <p className="text-gray-500 text-sm mt-1">Check back soon for newly published government opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              isSavedInitial={savedSchemeIds.includes(scheme.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={12}
            onPageChange={(p: number) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
};

export default CitizenNewSchemesPage;
