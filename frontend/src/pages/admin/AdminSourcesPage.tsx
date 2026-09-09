import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { Server, RefreshCw, Database, ExternalLink, Power, History, CheckCircle, AlertTriangle } from 'lucide-react';

export const AdminSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [syncResult, setSyncResult] = useState<any | null>(null);
  const [selectedLogsSource, setSelectedLogsSource] = useState<any | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    setLoading(true);
    try {
      const res = await adminService.getSources();
      if (res.success && res.data) {
        setSources(res.data);
      }
    } catch (err) {
      console.error('Error loading government sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSync = async (id: number) => {
    setSyncingId(id);
    setSyncResult(null);
    setAlert(null);
    try {
      const res = await adminService.syncSource(id);
      if (res.success && res.data) {
        setSyncResult(res.data);
        setAlert({
          type: 'success',
          message: `Sync finished for ${res.data.source}. Fetched: ${res.data.recordsFetched}, Created: ${res.data.recordsCreated}, Updated: ${res.data.recordsUpdated}.`,
        });
        loadSources();
      }
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to trigger synchronization.',
      });
    } finally {
      setSyncingId(null);
    }
  };

  const handleToggleStatus = async (source: any) => {
    try {
      if (source.active) {
        await adminService.deactivateSource(source.id);
        setAlert({ type: 'success', message: `Deactivated source: ${source.name}` });
      } else {
        await adminService.activateSource(source.id);
        setAlert({ type: 'success', message: `Activated source: ${source.name}` });
      }
      loadSources();
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to update source status.' });
    }
  };

  const handleViewLogs = async (source: any) => {
    setSelectedLogsSource(source);
    setLoadingLogs(true);
    try {
      const res = await adminService.getSourceSyncLogs(source.id);
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error('Failed to load sync logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Server className="w-4 h-4" /> Official Data Aggregation Pipeline
        </div>
        <h1 className="text-2xl font-black text-slate-900">Government Data Sources & API Sync</h1>
        <p className="text-xs text-slate-500">
          Manage official government API endpoints, data set resource IDs, deduplication parameters, and manual/scheduled ingestion pipeline cycles.
        </p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Sync Result Summary */}
      {syncResult && (
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-xs text-emerald-900 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Synchronization Result: {syncResult.source} ({syncResult.status})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Fetched</span>
              <span className="text-base font-black text-slate-800">{syncResult.recordsFetched}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-600 block text-[10px] uppercase font-bold">Created</span>
              <span className="text-base font-black text-emerald-700">{syncResult.recordsCreated}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-blue-600 block text-[10px] uppercase font-bold">Updated</span>
              <span className="text-base font-black text-blue-700">{syncResult.recordsUpdated}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Skipped</span>
              <span className="text-base font-black text-slate-700">{syncResult.recordsSkipped}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-rose-600 block text-[10px] uppercase font-bold">Failed</span>
              <span className="text-base font-black text-rose-700">{syncResult.recordsFailed}</span>
            </div>
          </div>
        </div>
      )}

      {/* Sources List */}
      {loading ? (
        <LoadingSpinner message="Loading government source configurations..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sources.map((source) => (
            <div key={source.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {source.contentType} • {source.sourceType}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{source.name}</h3>
                    <p className="text-xs text-slate-500">{source.description}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                      source.active ? 'text-emerald-700 bg-emerald-100' : 'text-slate-600 bg-slate-100'
                    }`}
                  >
                    {source.active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[11px] font-bold text-slate-700 truncate max-w-[220px]">
                      {source.apiUrl || source.baseUrl}
                    </span>
                    {source.documentationUrl && (
                      <a
                        href={source.documentationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-bold hover:underline flex items-center gap-0.5 text-[11px]"
                      >
                        Docs <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Auth: {source.authenticationType} ({source.credentialReference || 'None'})</span>
                    <span>Schedule: {source.syncFrequency}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <span>
                    Last Sync:{' '}
                    <strong className="text-slate-800">
                      {source.lastSyncAt ? new Date(source.lastSyncAt).toLocaleString() : 'Never'}
                    </strong>
                  </span>
                  {source.lastSyncStatus && (
                    <span
                      className={`font-bold text-[10px] px-1.5 py-0.5 rounded uppercase ${
                        source.lastSyncStatus === 'SUCCESS' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                      }`}
                    >
                      {source.lastSyncStatus}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(source)}
                    className={`btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 ${
                      source.active ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {source.active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleViewLogs(source)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <History className="w-3.5 h-3.5" /> Logs
                  </button>
                </div>

                <button
                  onClick={() => handleTriggerSync(source.id)}
                  disabled={syncingId === source.id || !source.active}
                  className="btn-primary text-xs py-1.5 px-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingId === source.id ? 'animate-spin' : ''}`} />
                  {syncingId === source.id ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sync Logs Modal / Drawer */}
      {selectedLogsSource && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              Sync History Logs: {selectedLogsSource.name}
            </h3>
            <button
              onClick={() => setSelectedLogsSource(null)}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              ✕ Close
            </button>
          </div>

          {loadingLogs ? (
            <LoadingSpinner message="Loading logs history..." />
          ) : logs.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">No synchronization logs recorded yet for this source.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-3">Started At</th>
                    <th className="p-3">Completed At</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Fetched</th>
                    <th className="p-3 text-center">Created</th>
                    <th className="p-3 text-center">Updated</th>
                    <th className="p-3 text-center">Failed</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="p-3 text-slate-700">{new Date(log.startedAt).toLocaleString()}</td>
                      <td className="p-3 text-slate-500">{log.completedAt ? new Date(log.completedAt).toLocaleString() : 'In Progress'}</td>
                      <td className="p-3">
                        <span
                          className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                            log.status === 'SUCCESS'
                              ? 'text-emerald-700 bg-emerald-100'
                              : log.status === 'PARTIAL_SUCCESS'
                              ? 'text-amber-700 bg-amber-100'
                              : 'text-rose-700 bg-rose-100'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-slate-700">{log.recordsFetched}</td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-700">{log.recordsCreated}</td>
                      <td className="p-3 text-center font-mono font-bold text-blue-700">{log.recordsUpdated}</td>
                      <td className="p-3 text-center font-mono font-bold text-rose-700">{log.recordsFailed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
