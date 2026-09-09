import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { schemeService } from '../../services/schemeService';
import { Scheme, PageResponse } from '../../types';
import { SchemeCard } from '../../components/SchemeCard';
import { Pagination } from '../../components/Pagination';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Search, Filter, RefreshCw } from 'lucide-react';

export const SchemesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [schemeType, setSchemeType] = useState(searchParams.get('schemeType') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [page, setPage] = useState(0);

  const [schemesData, setSchemesData] = useState<PageResponse<Scheme> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemes();
  }, [page, searchParams]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await schemeService.getPublicSchemes({
        keyword: searchParams.get('keyword') || undefined,
        state: searchParams.get('state') || undefined,
        schemeType: searchParams.get('schemeType') || undefined,
        categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
        page,
        size: 9,
      });

      if (res.success) {
        setSchemesData(res.data);
      }
    } catch (err) {
      console.error('Error fetching schemes:', err);
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
    if (schemeType) newParams.schemeType = schemeType;
    if (categoryId) newParams.categoryId = categoryId;
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setState('');
    setSchemeType('');
    setCategoryId('');
    setPage(0);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-lg space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black">Government Schemes & Subsidies</h1>
        <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
          Search and discover Central and State government programs, capital subsidies, margin money grants, and loan guarantee support.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 items-end">
          {/* Keyword Search */}
          <div className="md:col-span-2">
            <label className="label-field">Search Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search scheme name, department..."
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
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="label-field">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-field">
              <option value="">All Categories</option>
              <option value="1">MSME & Small Business</option>
              <option value="2">Subsidies & Grants</option>
              <option value="3">Loans & Credit Support</option>
              <option value="4">Food Processing & Agri</option>
              <option value="5">Startup & Innovation</option>
              <option value="6">Education & Scholarships</option>
              <option value="7">Healthcare & Medical</option>
              <option value="8">Housing & Urban Dev</option>
              <option value="9">Women Empowerment</option>
              <option value="10">SC/ST Welfare</option>
              <option value="11">Senior Citizens Welfare</option>
              <option value="12">Persons with Disabilities</option>
              <option value="13">Employment & Skill Development</option>
              <option value="14">State Government Schemes</option>
            </select>
          </div>

          {/* Scheme Type Filter */}
          <div>
            <label className="label-field">Scheme Type</label>
            <select value={schemeType} onChange={(e) => setSchemeType(e.target.value)} className="input-field">
              <option value="">All Types</option>
              <option value="Subsidy">Subsidy</option>
              <option value="Grant">Grant</option>
              <option value="Loan">Loan & Credit</option>
              <option value="Equity">Equity & Seed Fund</option>
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
              className="btn-secondary text-xs px-3 py-2.5"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <LoadingSpinner message="Loading matching schemes from database..." />
      ) : schemesData && schemesData.content.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schemesData.content.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>

          <Pagination
            currentPage={schemesData.pageNumber}
            totalPages={schemesData.totalPages}
            totalElements={schemesData.totalElements}
            pageSize={schemesData.pageSize}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      ) : (
        <EmptyState
          title="No Schemes Found"
          description="We couldn't find any public government schemes matching your filter parameters. Try clearing your search query or selecting 'All States'."
          action={
            <button onClick={handleResetFilters} className="btn-primary text-xs">
              Clear All Filters
            </button>
          }
        />
      )}
    </div>
  );
};
