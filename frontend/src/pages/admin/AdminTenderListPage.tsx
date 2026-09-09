import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Tender, PageResponse } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Pagination } from '../../components/Pagination';
import { Alert } from '../../components/Alert';
import { EmptyState } from '../../components/EmptyState';
import { Layers, PlusCircle, Edit3, CheckCircle, Power, Archive, Sparkles } from 'lucide-react';

export const AdminTenderListPage: React.FC = () => {
  const [tendersData, setTendersData] = useState<PageResponse<Tender> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadTenders();
  }, [page]);

  const loadTenders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllTenders(page, 10);
      if (res.success) {
        setTendersData(res.data);
      }
    } catch (err) {
      console.error('Error loading tenders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: number) => {
    try {
      const res = await adminService.publishTender(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Tender published live!' });
        loadTenders();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to publish tender.' });
    }
  };

  const handleClose = async (id: number) => {
    try {
      const res = await adminService.closeTender(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Tender marked as closed.' });
        loadTenders();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to close tender.' });
    }
  };

  const handleArchive = async (id: number) => {
    try {
      const res = await adminService.archiveTender(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Tender archived.' });
        loadTenders();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to archive tender.' });
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const res = await adminService.toggleTenderFeatured(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Tender featured status updated.' });
        loadTenders();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to update featured status.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Government Tenders</h1>
          <p className="text-xs text-slate-500">Admin procurement tender lifecycle control (DRAFT → PUBLISHED → CLOSED → ARCHIVED)</p>
        </div>

        <Link to="/admin/tenders/create" className="btn-primary text-xs py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700">
          <PlusCircle className="w-4 h-4" /> Add New Tender
        </Link>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {loading ? (
        <LoadingSpinner message="Fetching procurement tenders repository..." />
      ) : tendersData && tendersData.content.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Tender Number</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Organization</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Lifecycle Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tendersData.content.map((tender) => (
                  <tr key={tender.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{tender.tenderNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">{tender.title}</td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-xs">{tender.organization}</td>
                    <td className="py-3.5 px-4 text-slate-600">{tender.state}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={tender.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeatured(tender.id)}
                        className={`p-1 rounded ${tender.featured ? 'text-amber-500 bg-amber-50' : 'text-slate-300'}`}
                        title="Toggle Featured"
                      >
                        <Sparkles className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <Link
                        to={`/admin/tenders/${tender.id}/edit`}
                        className="btn-secondary py-1 px-2.5 text-xs inline-flex items-center gap-1"
                        title="Edit Tender"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </Link>

                      {tender.status !== 'PUBLISHED' && tender.status !== 'ACTIVE' && (
                        <button
                          onClick={() => handlePublish(tender.id)}
                          className="btn-success py-1 px-2.5 text-xs inline-flex items-center gap-1"
                          title="Publish Tender Live"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Publish
                        </button>
                      )}

                      {(tender.status === 'PUBLISHED' || tender.status === 'ACTIVE') && (
                        <button
                          onClick={() => handleClose(tender.id)}
                          className="btn-secondary py-1 px-2.5 text-xs inline-flex items-center gap-1 text-rose-700 hover:bg-rose-50"
                          title="Close Tender Bidding"
                        >
                          <Power className="w-3.5 h-3.5" /> Close
                        </button>
                      )}

                      {tender.status !== 'ARCHIVED' && (
                        <button
                          onClick={() => handleArchive(tender.id)}
                          className="btn-secondary py-1 px-2 text-xs inline-flex items-center gap-1 text-slate-500"
                          title="Archive Tender"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        <EmptyState title="No Tenders Found" description="No government tenders currently exist in the database." />
      )}
    </div>
  );
};
