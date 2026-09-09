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
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <FileText className="w-4 h-4" /> Internal Activity Tracker
        </div>
        <h1 className="text-2xl font-black text-slate-900">My Application Tracker</h1>
        <p className="text-xs text-slate-500">
          Track your progress on government schemes and tenders (INTERESTED → PREPARING → APPLIED → COMPLETED).
        </p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {loading ? (
        <LoadingSpinner message="Fetching tracked applications..." />
      ) : applications.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
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
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                      {app.title}
                      {app.schemeTitle && (
                        <span className="block text-[11px] text-blue-600 font-normal">Scheme: {app.schemeTitle}</span>
                      )}
                      {app.tenderTitle && (
                        <span className="block text-[11px] text-indigo-600 font-normal">Tender: {app.tenderTitle}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="INTERESTED">INTERESTED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="APPLIED">APPLIED</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {app.notes || app.applicationNumber || 'No notes added.'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-rose-600 hover:text-rose-800 p-1.5 rounded hover:bg-rose-50 font-bold"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
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
          description="Click 'Track My Application Activity' on any Scheme or Tender detail page to start tracking your progress."
        />
      )}
    </div>
  );
};
