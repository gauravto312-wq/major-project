import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { BusinessProfile, PageResponse } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Pagination } from '../../components/Pagination';
import { EmptyState } from '../../components/EmptyState';
import { AdminHeaderNav } from '../../components/AdminHeaderNav';
import { Building2, Eye, Clock, CheckCircle, ShieldCheck } from 'lucide-react';

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
    <>
      <AdminHeaderNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner with Vidhan Bhawan Visual Identity */}
      <div
        className="relative rounded-3xl p-6 sm:p-8 text-white shadow-gov-lg overflow-hidden space-y-2 bg-[#173B72]"
        style={{
          backgroundImage: "url('/assets/vidhan-bhawan.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#173B72]/95 via-[#173B72]/90 to-[#0F264A]/95 backdrop-blur-[1px]"></div>

        <div className="relative z-10 space-y-1 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#1B8354]" /> Admin Verification Panel
          </div>
          <h1 className="text-2xl font-black text-white">Business Verification Applications</h1>
          <p className="text-xs text-[#F5F7FA]/90">
            Inspect registered business details, uploaded GST/UDYAM documents, and issue verification decisions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          type="button"
          onClick={() => { setActiveTab('PENDING'); setPage(0); }}
          className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'PENDING'
              ? 'border-[#B7791F] text-[#B7791F]'
              : 'border-transparent text-[#5E6B7D] hover:text-[#172033]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#C89B3C]" />
          Pending Verifications
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('ALL'); setPage(0); }}
          className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'ALL'
              ? 'border-[#173B72] text-[#173B72]'
              : 'border-transparent text-[#5E6B7D] hover:text-[#172033]'
          }`}
        >
          <Building2 className="w-4 h-4 text-[#173B72]" />
          All Registered Businesses
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Fetching business verification applications..." />
      ) : businesses && businesses.content.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-gov overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-[#5E6B7D] uppercase tracking-wider font-bold border-b border-slate-200">
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
                  <tr key={b.id} className="hover:bg-[#F5F7FA]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#172033]">{b.businessName}</td>
                    <td className="py-3.5 px-4 text-[#5E6B7D] font-semibold">{b.businessType}</td>
                    <td className="py-3.5 px-4 text-[#5E6B7D]">{b.industry}</td>
                    <td className="py-3.5 px-4 text-[#5E6B7D]">{b.district}, {b.state}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={b.verificationStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-[#5E6B7D]">
                      {b.submittedAt ? new Date(b.submittedAt).toLocaleDateString() : 'Draft'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/businesses/${b.id}`}
                        className="inline-flex items-center gap-1 btn-primary py-1 px-3 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect & Verify
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
            onPageChange={(p) => setPage(p)}
          />
        </div>
      ) : (
        <EmptyState
          title="No Businesses In Queue"
          description="There are currently no business verification requests matching this tab."
        />
      )}
      </div>
    </>
  );
};
