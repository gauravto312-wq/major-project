import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AuditLog, PageResponse } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Pagination } from '../../components/Pagination';
import { Activity, Shield } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Shield className="w-4 h-4 text-indigo-600" /> Platform Security & Audit Trail
        </div>
        <h1 className="text-2xl font-black text-slate-900">Administrative Audit Logs</h1>
        <p className="text-xs text-slate-500">Immutable historical trail of all administrative approvals, publishing actions, and status updates.</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching audit logs..." />
      ) : logsData && logsData.content.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
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
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{log.actorEmail || 'ADMIN'}</td>
                    <td className="py-3 px-4 text-blue-700 font-bold">{log.action}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {log.entityType} #{log.entityId}
                    </td>
                    <td className="py-3 px-4 font-sans text-xs text-slate-700">{log.description}</td>
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
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          No administrative audit logs generated yet.
        </div>
      )}
    </div>
  );
};
