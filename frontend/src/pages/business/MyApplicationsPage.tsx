import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import { UserApplication, ApplicationStatus } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Alert } from '../../components/Alert';
import { EmptyState } from '../../components/EmptyState';
import { FileText, Trash2, CheckCircle } from 'lucide-react';

export const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getApplications();
      if (res.success) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: ApplicationStatus) => {
    try {
      const res = await applicationService.updateStatus(id, newStatus);
      if (res.success) {
        setAlert({ type: 'success', message: 'Application tracking status updated!' });
        loadApplications();
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: 'Failed to update status.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this tracked application record?')) return;
    try {
      const res = await applicationService.deleteApplication(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Application record deleted.' });
        loadApplications();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to delete record.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-gov space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#173B72] uppercase tracking-wider">
          <FileText className="w-4 h-4 text-[#173B72]" /> Internal Enterprise Activity Tracker
        </div>
        <h1 className="text-2xl font-black text-[#172033]">My Application Tracker</h1>
        <p className="text-xs text-[#5E6B7D]">
          Track your progress on government schemes and tenders (INTERESTED → PREPARING → APPLIED → COMPLETED).
        </p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {loading ? (
        <LoadingSpinner message="Fetching tracked applications..." />
      ) : applications.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-gov overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-[#5E6B7D] uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Opportunity Title</th>
                  <th className="py-3 px-4">Tracking Status</th>
                  <th className="py-3 px-4">Application Date</th>
                  <th className="py-3 px-4">Notes / App Ref</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#F5F7FA]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#172033] max-w-xs">
                      {app.title}
                      {app.schemeTitle && (
                        <span className="block text-[11px] text-[#173B72] font-normal">Scheme: {app.schemeTitle}</span>
                      )}
                      {app.tenderTitle && (
                        <span className="block text-[11px] text-[#2456A6] font-normal">Tender: {app.tenderTitle}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        aria-label={`Change status for ${app.title}`}
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#173B72]"
                      >
                        <option value="INTERESTED">INTERESTED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="APPLIED">APPLIED</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-[#5E6B7D]">
                      {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : (app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'In Progress')}
                    </td>
                    <td className="py-3.5 px-4 text-[#5E6B7D] truncate max-w-xs">
                      {app.notes || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        aria-label={`Delete record for ${app.title}`}
                        onClick={() => handleDelete(app.id)}
                        className="inline-flex items-center gap-1 text-[#C53030] hover:text-[#A82525] font-bold px-2 py-1 bg-[#FDF2F2] rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Tracked Applications"
          description="Click 'Track Application' on any scheme or tender detail page to monitor submission milestones."
        />
      )}
    </div>
  );
};
