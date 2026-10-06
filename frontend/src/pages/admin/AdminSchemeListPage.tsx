import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Scheme, PageResponse } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Pagination } from '../../components/Pagination';
import { Alert } from '../../components/Alert';
import { EmptyState } from '../../components/EmptyState';
import { AdminHeaderNav } from '../../components/AdminHeaderNav';
import { FileText, PlusCircle, Edit3, CheckCircle, Power, Archive, Sparkles, ShieldCheck } from 'lucide-react';

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
    <>
      <AdminHeaderNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner with Vidhan Bhawan Visual Identity */}
      <div
        className="relative rounded-3xl p-6 sm:p-8 text-white shadow-gov-lg overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#173B72]"
        style={{
          backgroundImage: "url('/assets/vidhan-bhawan.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#173B72]/95 via-[#173B72]/90 to-[#0F264A]/95 backdrop-blur-[1px]"></div>

        <div className="relative z-10 space-y-1">
          <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1B8354]" /> Program Registry Governance
          </span>
          <h1 className="text-2xl font-black text-white">Manage Schemes & Subsidies</h1>
          <p className="text-xs text-[#F5F7FA]/90">
            Admin scheme lifecycle control (DRAFT → PUBLISHED → INACTIVE → ARCHIVED)
          </p>
        </div>

        <div className="relative z-10">
          <Link to="/admin/schemes/create" className="btn-accent text-xs py-2.5 px-4 font-bold">
            <PlusCircle className="w-4 h-4" /> Add New Scheme
          </Link>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {loading ? (
        <LoadingSpinner message="Fetching schemes repository..." />
      ) : schemesData && schemesData.content.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-gov overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-[#5E6B7D] uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Scheme Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemesData.content.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F5F7FA]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#172033] max-w-xs">
                      {s.title}
                      <span className="block font-mono text-[10px] text-[#5E6B7D]">Slug: {s.slug}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#173B72]">{s.schemeType}</td>
                    <td className="py-3.5 px-4 text-[#5E6B7D]">{s.state}</td>
                    <td className="py-3.5 px-4 text-[#5E6B7D] truncate max-w-[140px]">{s.department}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={s.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        aria-label={`Toggle featured for ${s.title}`}
                        onClick={() => handleToggleFeatured(s.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          s.featured
                            ? 'bg-[#FEF7E6] text-[#B7791F] border-[#F8D88E]'
                            : 'bg-[#F5F7FA] text-slate-400 border-slate-200'
                        }`}
                        title="Toggle Featured"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <Link
                        to={`/admin/schemes/${s.id}/edit`}
                        className="inline-flex items-center gap-1 text-[#173B72] hover:text-[#2456A6] font-bold px-2 py-1 bg-[#E5EEF9] rounded text-[11px]"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </Link>

                      {s.status !== 'PUBLISHED' && (
                        <button
                          type="button"
                          onClick={() => handlePublish(s.id)}
                          className="inline-flex items-center gap-1 text-[#1B8354] hover:text-[#156B43] font-bold px-2 py-1 bg-[#EBF7F0] rounded text-[11px]"
                        >
                          <CheckCircle className="w-3 h-3" /> Publish
                        </button>
                      )}

                      {s.status === 'PUBLISHED' && (
                        <button
                          type="button"
                          onClick={() => handleDeactivate(s.id)}
                          className="inline-flex items-center gap-1 text-[#B7791F] hover:text-[#975A16] font-bold px-2 py-1 bg-[#FEF7E6] rounded text-[11px]"
                        >
                          <Power className="w-3 h-3" /> Deactivate
                        </button>
                      )}

                      {s.status !== 'ARCHIVED' && (
                        <button
                          type="button"
                          onClick={() => handleArchive(s.id)}
                          className="inline-flex items-center gap-1 text-[#5E6B7D] hover:text-[#172033] font-bold px-2 py-1 bg-slate-100 rounded text-[11px]"
                        >
                          <Archive className="w-3 h-3" /> Archive
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
            onPageChange={(p) => setPage(p)}
          />
        </div>
      ) : (
        <EmptyState title="No Schemes Found" description="Click 'Add New Scheme' to create a manual scheme record." />
      )}
      </div>
    </>
  );
};
