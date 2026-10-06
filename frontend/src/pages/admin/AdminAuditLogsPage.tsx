import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AuditLog, PageResponse } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Pagination } from '../../components/Pagination';
import { AdminHeaderNav } from '../../components/AdminHeaderNav';
import { Activity, Shield, ShieldCheck } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logsData, setLogsData] = useState<PageResponse<AuditLog> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs(page, 15);
      if (res.success) {
        setLogsData(res.data);
      }
    } catch (err) {
      console.error('Error loading audit logs:', err);
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
            <ShieldCheck className="w-4 h-4 text-[#1B8354]" /> Platform Security & Audit Trail
          </div>
          <h1 className="text-2xl font-black text-white">Administrative Audit Logs</h1>
          <p className="text-xs text-[#F5F7FA]/90">
            Immutable historical trail of all administrative approvals, publishing actions, and status updates.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching audit logs..." />
      ) : logsData && logsData.content.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-gov overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-[#5E6B7D] uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Admin Actor</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Target Entity</th>
                  <th className="py-3.5 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {logsData.content.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F5F7FA]/60 transition-colors">
                    <td className="py-3 px-4 text-[#5E6B7D]">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-[#172033]">{log.actorEmail || 'ADMIN'}</td>
                    <td className="py-3 px-4 text-[#173B72] font-bold">{log.action}</td>
                    <td className="py-3 px-4 text-[#5E6B7D]">
                      {log.entityType} #{log.entityId}
                    </td>
                    <td className="py-3 px-4 font-sans text-xs text-[#172033]">{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={logsData.pageNumber}
            totalPages={logsData.totalPages}
            totalElements={logsData.totalElements}
            pageSize={logsData.pageSize}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-[#5E6B7D] shadow-gov">
          No administrative audit logs generated yet.
        </div>
      )}
      </div>
    </>
  );
};
