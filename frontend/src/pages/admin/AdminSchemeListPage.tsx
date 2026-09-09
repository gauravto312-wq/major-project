import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Scheme, PageResponse } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Pagination } from '../../components/Pagination';
import { Alert } from '../../components/Alert';
import { EmptyState } from '../../components/EmptyState';
import { FileText, PlusCircle, Edit3, CheckCircle, Power, Archive, Sparkles } from 'lucide-react';

export const AdminSchemeListPage: React.FC = () => {
  const [schemesData, setSchemesData] = useState<PageResponse<Scheme> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadSchemes();
  }, [page]);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllSchemes(page, 10);
      if (res.success) {
        setSchemesData(res.data);
      }
    } catch (err) {
      console.error('Error loading schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: number) => {
    try {
      const res = await adminService.publishScheme(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Scheme published live to portal!' });
        loadSchemes();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to publish scheme.' });
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      const res = await adminService.deactivateScheme(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Scheme deactivated.' });
        loadSchemes();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to deactivate scheme.' });
    }
  };

  const handleArchive = async (id: number) => {
    try {
      const res = await adminService.archiveScheme(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Scheme archived.' });
        loadSchemes();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to archive scheme.' });
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const res = await adminService.toggleSchemeFeatured(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Featured status updated.' });
        loadSchemes();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to toggle featured status.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Schemes & Subsidies</h1>
          <p className="text-xs text-slate-500">Admin scheme lifecycle control (DRAFT → PUBLISHED → INACTIVE → ARCHIVED)</p>
        </div>

        <Link to="/admin/schemes/create" className="btn-primary text-xs py-2.5 px-4 bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="w-4 h-4" /> Add New Scheme
        </Link>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {loading ? (
        <LoadingSpinner message="Fetching schemes repository..." />
      ) : schemesData && schemesData.content.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Scheme Title</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Lifecycle Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemesData.content.map((scheme) => (
                  <tr key={scheme.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">{scheme.title}</td>
                    <td className="py-3.5 px-4 text-slate-600">{scheme.department}</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-700">{scheme.schemeType}</td>
                    <td className="py-3.5 px-4 text-slate-600">{scheme.state}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={scheme.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeatured(scheme.id)}
                        className={`p-1 rounded ${scheme.featured ? 'text-amber-500 bg-amber-50' : 'text-slate-300'}`}
                        title="Toggle Featured"
                      >
                        <Sparkles className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <Link
                        to={`/admin/schemes/${scheme.id}/edit`}
                        className="btn-secondary py-1 px-2.5 text-xs inline-flex items-center gap-1"
                        title="Edit Scheme"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </Link>

                      {scheme.status !== 'PUBLISHED' && scheme.status !== 'ACTIVE' && (
                        <button
                          onClick={() => handlePublish(scheme.id)}
                          className="btn-success py-1 px-2.5 text-xs inline-flex items-center gap-1"
                          title="Publish Scheme Live"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Publish
                        </button>
                      )}

                      {(scheme.status === 'PUBLISHED' || scheme.status === 'ACTIVE') && (
                        <button
                          onClick={() => handleDeactivate(scheme.id)}
                          className="btn-secondary py-1 px-2.5 text-xs inline-flex items-center gap-1 text-purple-700 hover:bg-purple-50"
                          title="Deactivate Scheme"
                        >
                          <Power className="w-3.5 h-3.5" /> Deactivate
                        </button>
                      )}

                      {scheme.status !== 'ARCHIVED' && (
                        <button
                          onClick={() => handleArchive(scheme.id)}
                          className="btn-secondary py-1 px-2 text-xs inline-flex items-center gap-1 text-slate-500"
                          title="Archive Scheme"
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
            currentPage={schemesData.pageNumber}
            totalPages={schemesData.totalPages}
            totalElements={schemesData.totalElements}
            pageSize={schemesData.pageSize}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      ) : (
        <EmptyState title="No Schemes Found" description="No government schemes currently exist in the database." />
      )}
    </div>
  );
};
