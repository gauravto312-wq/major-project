import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tenderService } from '../../services/tenderService';
import { Tender, PageResponse } from '../../types';
import { TenderCard } from '../../components/TenderCard';
import { Pagination } from '../../components/Pagination';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Alert } from '../../components/Alert';
import { Search, Filter, RefreshCw, ShieldCheck } from 'lucide-react';

const INDIAN_STATES = [
  'Uttar Pradesh',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttarakhand',
  'West Bengal',
  'Delhi (NCT)',
  'Jammu & Kashmir',
  'Ladakh',
  'Chandigarh',
  'Puducherry',
];

export const TendersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [page, setPage] = useState(0);

  const [tendersData, setTendersData] = useState<PageResponse<Tender> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTenders();
  }, [page, searchParams]);

  const fetchTenders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tenderService.getPublicTenders({
        keyword: searchParams.get('keyword') || undefined,
        state: searchParams.get('state') || undefined,
        page,
        size: 8,
      });

      if (res.success) {
        setTendersData(res.data);
      } else {
        setError('Failed to fetch tender notices from the server.');
      }
    } catch (err) {
      console.error('Error fetching tenders:', err);
      setError('Unable to reach procurement repository. Please verify the backend service is running.');
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
      {/* Header Banner with Vidhan Bhawan Visual Identity */}
      <div
        className="relative rounded-3xl p-8 text-white shadow-gov-lg overflow-hidden bg-[#173B72]"
        style={{
          backgroundImage: "url('/assets/vidhan-bhawan.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#173B72]/95 via-[#173B72]/85 to-[#0F264A]/95 backdrop-blur-[1px]"></div>

        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#F3E8D0] border border-[#C89B3C]/40">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1B8354]" />
            <span>Official Government Procurement Notices</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Government Procurement Tenders
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F7FA]/90 leading-relaxed">
            Discover active central and state procurement tenders for IT infrastructure, solar energy, machinery, civil works, and food processing equipment across Uttar Pradesh and all India.
          </p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
          {/* Keyword Search */}
          <div className="md:col-span-2">
            <label htmlFor="tender-keyword" className="label-field">
              Search Tender / Org / Number
            </label>
            <div className="relative">
              <Search className="input-leading-icon" />
              <input
                id="tender-keyword"
                type="text"
                placeholder="Search tender number, organization, title..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="input-field has-left-icon"
              />
            </div>
          </div>

          {/* State Filter */}
          <div>
            <label htmlFor="tender-state" className="label-field">
              State / Region
            </label>
            <select
              id="tender-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="input-field"
            >
              <option value="">All States / Pan India</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-xs w-full py-2.5">
              <Filter className="w-3.5 h-3.5" />
              Apply
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              aria-label="Reset Filters"
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
        <LoadingSpinner message="Loading procurement notices from database..." />
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
          description="We couldn't find any procurement tenders matching your current search parameters. Try clearing your search keyword."
          action={
            <button type="button" onClick={handleResetFilters} className="btn-primary text-xs">
              Clear All Filters
            </button>
          }
        />
      )}
    </div>
  );
};
