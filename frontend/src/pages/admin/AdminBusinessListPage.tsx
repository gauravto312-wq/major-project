import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { BusinessProfile, PageResponse } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Pagination } from '../../components/Pagination';
import { EmptyState } from '../../components/EmptyState';
import { Building2, Eye, Clock, CheckCircle } from 'lucide-react';

export const AdminBusinessListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ALL'>('PENDING');
  const [businesses, setBusinesses] = useState<PageResponse<BusinessProfile> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, [activeTab, page]);

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const res = activeTab === 'PENDING'
        ? await adminService.getPendingBusinesses(page, 10)
        : await adminService.getAllBusinesses(page, 10);

      if (res.success) {
        setBusinesses(res.data);
      }
    } catch (err) {
      console.error('Error loading businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Building2 className="w-4 h-4" /> Admin Verification Panel
        </div>
        <h1 className="text-2xl font-black text-slate-900">Business Verification Applications</h1>
        <p className="text-xs text-slate-500">Inspect registered business details, uploaded GST/UDYAM documents, and issue verification decisions.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => { setActiveTab('PENDING'); setPage(0); }}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'PENDING'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending Verifications
        </button>

        <button
          onClick={() => { setActiveTab('ALL'); setPage(0); }}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'ALL'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          All Registered Businesses
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Fetching business verification applications..." />
      ) : businesses && businesses.content.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Business Name</th>
                  <th className="py-3.5 px-4">Entity Type</th>
                  <th className="py-3.5 px-4">Industry</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businesses.content.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.businessName}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">{b.businessType}</td>
                    <td className="py-3.5 px-4 text-slate-600">{b.industry}</td>
                    <td className="py-3.5 px-4 text-slate-600">{b.district}, {b.state}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={b.verificationStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {b.submittedAt ? new Date(b.submittedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/businesses/${b.id}`}
                        className="btn-primary text-xs py-1.5 px-3 bg-blue-600 hover:bg-blue-700"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Review Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={businesses.pageNumber}
            totalPages={businesses.totalPages}
            totalElements={businesses.totalElements}
            pageSize={businesses.pageSize}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      ) : (
        <EmptyState
          title={activeTab === 'PENDING' ? 'No Pending Verifications' : 'No Businesses Registered'}
          description={activeTab === 'PENDING' ? 'Great job! There are currently no pending business verification applications in queue.' : 'No businesses have registered yet.'}
        />
      )}
    </div>
  );
};
