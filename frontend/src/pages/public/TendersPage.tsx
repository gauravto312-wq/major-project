import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tenderService } from '../../services/tenderService';
import { Tender, PageResponse } from '../../types';
import { TenderCard } from '../../components/TenderCard';
import { Pagination } from '../../components/Pagination';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Search, Filter, RefreshCw, ShieldCheck } from 'lucide-react';

export const TendersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [page, setPage] = useState(0);

  const [tendersData, setTendersData] = useState<PageResponse<Tender> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenders();
  }, [page, searchParams]);

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const res = await tenderService.getPublicTenders({
        keyword: searchParams.get('keyword') || undefined,
        state: searchParams.get('state') || undefined,
        page,
        size: 8,
      });

      if (res.success) {
        setTendersData(res.data);
      }
    } catch (err) {
      console.error('Error fetching tenders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    const newParams: Record<string, string> = {};
    if (keyword.trim()) newParams.keyword = keyword.trim();
    if (state) newParams.state = state;
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setState('');
    setPage(0);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-8 text-white shadow-lg space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Government Procurement Contracts
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">Government Procurement Tenders</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Discover active central and state procurement tenders for IT infrastructure, solar energy, machinery, civil works, and food processing equipment.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
          {/* Keyword Search */}
          <div className="md:col-span-2">
            <label className="label-field">Search Tender / Org / Number</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search tender number, organization, title..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="input-field pl-9"
              />
            </div>
          </div>

          {/* State Filter */}
          <div>
            <label className="label-field">State / Region</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="input-field">
              <option value="">All States / Pan India</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-xs w-full py-2.5 bg-indigo-600 hover:bg-indigo-700">
              <Filter className="w-3.5 h-3.5" />
              Apply
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn-secondary text-xs px-3 py-2.5"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Tenders Grid */}
      {loading ? (
        <LoadingSpinner message="Loading government tenders..." />
      ) : tendersData && tendersData.content.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tendersData.content.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>

          <Pagination
            currentPage={tendersData.pageNumber}
            totalPages={tendersData.totalPages}
            totalElements={tendersData.totalElements}
            pageSize={tendersData.pageSize}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      ) : (
        <EmptyState
          title="No Tenders Found"
          description="We couldn't find any active government procurement tenders matching your search criteria."
          action={
            <button onClick={handleResetFilters} className="btn-primary text-xs">
              Clear Filters
            </button>
          }
        />
      )}
    </div>
  );
};
