import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { AdminHeaderNav } from '../../components/AdminHeaderNav';
import { Server, RefreshCw, ExternalLink, Power, History, CheckCircle, Activity, Plus, Edit3, X, Save } from 'lucide-react';

export const AdminSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [testingId, setTestingId] = useState<number | null>(null);
  const [syncResult, setSyncResult] = useState<any | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [selectedLogsSource, setSelectedLogsSource] = useState<any | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Add / Edit Source Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<number | null>(null);
  const [submittingSource, setSubmittingSource] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    providerCode: '',
    sourceType: 'GOVERNMENT_API',
    contentType: 'SCHEME',
    baseUrl: '',
    apiUrl: '',
    documentationUrl: '',
    authenticationType: 'NONE',
    credentialReference: '',
    autoPublish: false,
    syncFrequency: '0 0 */6 * * *',
    description: '',
  });

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

  const handleOpenAddModal = () => {
    setEditingSourceId(null);
    setFormData({
      name: '',
      providerCode: '',
      sourceType: 'GOVERNMENT_API',
      contentType: 'SCHEME',
      baseUrl: '',
      apiUrl: '',
      documentationUrl: '',
      authenticationType: 'NONE',
      credentialReference: '',
      autoPublish: false,
      syncFrequency: '0 0 */6 * * *',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (source: any) => {
    setEditingSourceId(source.id);
    setFormData({
      name: source.name || '',
      providerCode: source.providerCode || '',
      sourceType: source.sourceType || 'GOVERNMENT_API',
      contentType: source.contentType || 'SCHEME',
      baseUrl: source.baseUrl || '',
      apiUrl: source.apiUrl || '',
      documentationUrl: source.documentationUrl || '',
      authenticationType: source.authenticationType || 'NONE',
      credentialReference: source.credentialReference || '',
      autoPublish: !!source.autoPublish,
      syncFrequency: source.syncFrequency || '0 0 */6 * * *',
      description: source.description || '',
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSaveSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSource(true);
    setAlert(null);

    try {
      if (editingSourceId) {
        const res = await adminService.updateSource(editingSourceId, formData);
        if (res.success) {
          setAlert({ type: 'success', message: `Government Source '${formData.name}' updated successfully!` });
        }
      } else {
        const res = await adminService.createSource(formData);
        if (res.success) {
          setAlert({ type: 'success', message: `New Government Source '${formData.name}' configured successfully!` });
        }
      }
      setIsModalOpen(false);
      loadSources();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error saving government source.' });
    } finally {
      setSubmittingSource(false);
    }
  };

  const handleTestApi = async (id: number) => {
    setTestingId(id);
    setTestResult(null);
    setAlert(null);
    try {
      const res = await adminService.testSourceApi(id);
      if (res.success && res.data) {
        setTestResult(res.data);
        setAlert({
          type: res.data.working ? 'success' : 'error',
          message: `${res.data.sourceName}: ${res.data.message} (${res.data.responseTimeMs} ms, Status ${res.data.httpStatusCode})`,
        });
      }
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to test government API endpoint.',
      });
    } finally {
      setTestingId(null);
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
    <>
      <AdminHeaderNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner with Vidhan Bhawan Visual Identity & Add Source Button */}
      <div
        className="relative rounded-3xl p-6 sm:p-8 text-white shadow-gov-lg overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-[#173B72]"
        style={{
          backgroundImage: "url('/assets/vidhan-bhawan.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#173B72]/95 via-[#173B72]/90 to-[#0F264A]/95 backdrop-blur-[1px]"></div>

        <div className="relative z-10 space-y-1 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
            <Server className="w-4 h-4 text-[#1B8354]" /> Official Data Aggregation Pipeline
          </div>
          <h1 className="text-2xl font-black text-white">Government Data Sources & API Ingestion</h1>
          <p className="text-xs text-[#F5F7FA]/90">
            Configure official government API endpoints, test endpoint connectivity, set auto-publish parameters, and manage automated or manual ingestion cycles.
          </p>
        </div>

        <div className="relative z-10">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="btn-accent text-xs py-3 px-5 font-bold shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Government API
          </button>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* API Test Result Callout */}
      {testResult && (
        <div className={`p-4 rounded-2xl text-xs space-y-1 border ${testResult.working ? 'bg-[#EBF7F0] border-[#A3D9BD] text-[#1B8354]' : 'bg-[#FDF2F2] border-[#F8B4B4] text-[#C53030]'}`}>
          <div className="font-bold flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              API Test Result: {testResult.sourceName} — {testResult.working ? 'Working (200 OK)' : 'Failed'}
            </span>
            <span className="font-mono text-xs">{testResult.responseTimeMs} ms</span>
          </div>
          <p>{testResult.message}</p>
          {testResult.details && <p className="text-[11px] opacity-85 font-mono">{testResult.details}</p>}
        </div>
      )}

      {/* Sync Result Summary */}
      {syncResult && (
        <div className="bg-[#EBF7F0] border border-[#A3D9BD] p-5 rounded-2xl text-xs text-[#1B8354] space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-sm">
            <CheckCircle className="w-4 h-4 text-[#1B8354]" />
            Synchronization Result: {syncResult.source} ({syncResult.status})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center">
            <div className="bg-white p-2.5 rounded-xl border border-[#A3D9BD]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Fetched</span>
              <span className="text-base font-black text-[#172033]">{syncResult.recordsFetched}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#A3D9BD]">
              <span className="text-[#1B8354] block text-[10px] uppercase font-bold">Created</span>
              <span className="text-base font-black text-[#1B8354]">{syncResult.recordsCreated}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#A3D9BD]">
              <span className="text-[#173B72] block text-[10px] uppercase font-bold">Updated</span>
              <span className="text-base font-black text-[#173B72]">{syncResult.recordsUpdated}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#A3D9BD]">
              <span className="text-[#5E6B7D] block text-[10px] uppercase font-bold">Skipped</span>
              <span className="text-base font-black text-[#5E6B7D]">{syncResult.recordsSkipped}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#A3D9BD]">
              <span className="text-[#C53030] block text-[10px] uppercase font-bold">Failed</span>
              <span className="text-base font-black text-[#C53030]">{syncResult.recordsFailed}</span>
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
            <div key={source.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-gov space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#173B72] bg-[#E5EEF9] px-2 py-0.5 rounded border border-[#C7DBF2]">
                      {source.contentType} • {source.sourceType}
                    </span>
                    <h3 className="text-base font-bold text-[#172033] mt-1">{source.name}</h3>
                    <p className="text-xs text-[#5E6B7D]">{source.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(source)}
                      className="p-1.5 text-slate-400 hover:text-[#173B72] hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit API Source"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                        source.active ? 'text-[#1B8354] bg-[#EBF7F0] border border-[#A3D9BD]' : 'text-slate-600 bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {source.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#5E6B7D] bg-[#F5F7FA] p-3 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[11px] font-bold text-[#173B72] truncate max-w-[220px]">
                      {source.apiUrl || source.baseUrl}
                    </span>
                    {source.documentationUrl && (
                      <a
                        href={source.documentationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#173B72] font-bold hover:underline flex items-center gap-0.5 text-[11px]"
                      >
                        Docs <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex justify-between text-[11px] text-[#5E6B7D]">
                    <span>Auth: {source.authenticationType} ({source.credentialReference || 'None'})</span>
                    <span>Auto-Publish: <strong className={source.autoPublish ? 'text-[#1B8354]' : 'text-slate-500'}>{source.autoPublish ? 'ENABLED' : 'OFF'}</strong></span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-[#5E6B7D] pt-1">
                  <span>
                    Last Sync:{' '}
                    <strong className="text-[#172033]">
                      {source.lastSyncAt ? new Date(source.lastSyncAt).toLocaleString() : 'Never'}
                    </strong>
                  </span>
                  {source.lastSyncStatus && (
                    <span
                      className={`font-bold text-[10px] px-2 py-0.5 rounded uppercase ${
                        source.lastSyncStatus === 'SUCCESS' ? 'text-[#1B8354] bg-[#EBF7F0]' : 'text-[#B7791F] bg-[#FEF7E6]'
                      }`}
                    >
                      {source.lastSyncStatus}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(source)}
                    className={`btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 ${
                      source.active ? 'text-[#C53030] hover:bg-[#FDF2F2]' : 'text-[#1B8354] hover:bg-[#EBF7F0]'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {source.active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewLogs(source)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <History className="w-3.5 h-3.5" /> Logs
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestApi(source.id)}
                    disabled={testingId === source.id}
                    className="btn-secondary text-xs py-1.5 px-3 text-[#B7791F] border-[#B7791F]/30 hover:bg-[#FEF7E6] flex items-center gap-1"
                  >
                    <Activity className={`w-3.5 h-3.5 ${testingId === source.id ? 'animate-spin' : ''}`} />
                    {testingId === source.id ? 'Testing...' : 'Test API'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriggerSync(source.id)}
                    disabled={syncingId === source.id || !source.active}
                    className="btn-primary text-xs py-1.5 px-3 bg-[#173B72] hover:bg-[#2456A6] disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === source.id ? 'animate-spin' : ''}`} />
                    {syncingId === source.id ? 'Syncing...' : 'Sync Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Source Modal */}
      {isModalOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 bg-[#0F264A]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-gov-lg space-y-6 border border-slate-200 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-[#172033] flex items-center gap-2">
                <Server className="w-5 h-5 text-[#173B72]" />
                {editingSourceId ? 'Edit Government Source API' : 'Configure New Government API Source'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSource} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">API Source Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g. UP Nivesh Mitra Portal API"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-field">Provider Unique Code *</label>
                  <input
                    type="text"
                    name="providerCode"
                    required
                    value={formData.providerCode}
                    onChange={handleFormChange}
                    placeholder="e.g. UP_NIVESH_MITRA"
                    disabled={!!editingSourceId}
                    className="input-field disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="label-field">Source Type *</label>
                  <select
                    name="sourceType"
                    value={formData.sourceType}
                    onChange={handleFormChange}
                    className="input-field"
                  >
                    <option value="GOVERNMENT_API">Official Government API</option>
                    <option value="OPEN_DATA_PORTAL">Open Data Portal (data.gov.in)</option>
                    <option value="STATE_PORTAL">State Single Window Portal</option>
                    <option value="CENTRAL_PORTAL">Central Ministry Portal</option>
                    <option value="RSS_FEED">RSS / Atom Feed</option>
                  </select>
                </div>

                <div>
                  <label className="label-field">Content Type *</label>
                  <select
                    name="contentType"
                    value={formData.contentType}
                    onChange={handleFormChange}
                    className="input-field"
                  >
                    <option value="SCHEME">Government Schemes</option>
                    <option value="TENDER">Procurement Tenders</option>
                    <option value="BOTH">Schemes & Tenders</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="label-field">API Endpoint URL *</label>
                  <input
                    type="url"
                    name="apiUrl"
                    required
                    value={formData.apiUrl}
                    onChange={handleFormChange}
                    placeholder="https://niveshmitra.up.nic.in/api/v1/schemes"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-field">Portal Base URL *</label>
                  <input
                    type="url"
                    name="baseUrl"
                    required
                    value={formData.baseUrl}
                    onChange={handleFormChange}
                    placeholder="https://niveshmitra.up.nic.in"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-field">Documentation URL (Optional)</label>
                  <input
                    type="url"
                    name="documentationUrl"
                    value={formData.documentationUrl}
                    onChange={handleFormChange}
                    placeholder="https://niveshmitra.up.nic.in/docs"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-field">Authentication Type *</label>
                  <select
                    name="authenticationType"
                    value={formData.authenticationType}
                    onChange={handleFormChange}
                    className="input-field"
                  >
                    <option value="NONE">Public / None</option>
                    <option value="API_KEY">API Key Header</option>
                    <option value="OAUTH2">OAuth 2.0 Token</option>
                  </select>
                </div>

                <div>
                  <label className="label-field">API Key / Credential Reference</label>
                  <input
                    type="text"
                    name="credentialReference"
                    value={formData.credentialReference}
                    onChange={handleFormChange}
                    placeholder="e.g. UP_PORTAL_API_KEY"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#F5F7FA] p-4 rounded-2xl border border-slate-200">
                <input
                  type="checkbox"
                  id="autoPublishCheck"
                  name="autoPublish"
                  checked={formData.autoPublish}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-[#173B72] rounded border-slate-300 focus:ring-[#173B72]"
                />
                <label htmlFor="autoPublishCheck" className="text-xs text-[#172033] font-bold cursor-pointer">
                  Enable Auto-Publishing (Automatically publish valid schemes without pending review)
                </label>
              </div>

              <div>
                <label className="label-field">Description / Notes</label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Notes about this government department API source..."
                  className="input-field"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs py-2.5 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSource}
                  className="btn-primary text-xs py-2.5 px-6 font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {submittingSource ? 'Saving...' : editingSourceId ? 'Update API Source' : 'Save New Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sync Logs Modal / Drawer */}
      {selectedLogsSource && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-gov-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <History className="w-4 h-4 text-[#173B72]" />
              Sync History Logs: {selectedLogsSource.name}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedLogsSource(null)}
              aria-label="Close sync history logs"
              className="text-[#5E6B7D] hover:text-[#172033] font-bold text-sm p-1 rounded hover:bg-slate-100"
            >
              ✕ Close
            </button>
          </div>

          {loadingLogs ? (
            <LoadingSpinner message="Loading logs history..." />
          ) : logs.length === 0 ? (
            <p className="text-xs text-[#5E6B7D] italic py-4 text-center">No synchronization logs recorded yet for this source.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F5F7FA] border-b text-[#5E6B7D] font-bold uppercase text-[10px]">
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
                    <tr key={log.id} className="hover:bg-[#F5F7FA]/60">
                      <td className="p-3 text-[#172033]">{new Date(log.startedAt).toLocaleString()}</td>
                      <td className="p-3 text-[#5E6B7D]">{log.completedAt ? new Date(log.completedAt).toLocaleString() : 'In Progress'}</td>
                      <td className="p-3">
                        <span
                          className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                            log.status === 'SUCCESS'
                              ? 'text-[#1B8354] bg-[#EBF7F0]'
                              : log.status === 'PARTIAL_SUCCESS'
                              ? 'text-[#B7791F] bg-[#FEF7E6]'
                              : 'text-[#C53030] bg-[#FDF2F2]'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-[#172033]">{log.recordsFetched}</td>
                      <td className="p-3 text-center font-mono font-bold text-[#1B8354]">{log.recordsCreated}</td>
                      <td className="p-3 text-center font-mono font-bold text-[#173B72]">{log.recordsUpdated}</td>
                      <td className="p-3 text-center font-mono font-bold text-[#C53030]">{log.recordsFailed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      </div>
    </>
  );
};
