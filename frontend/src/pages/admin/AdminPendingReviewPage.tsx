import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Scheme, Tender } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { CheckCircle, XCircle, Clock, Building2, ExternalLink, Calendar, Layers } from 'lucide-react';

export const AdminPendingReviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schemes' | 'tenders'>('schemes');
  const [pendingSchemes, setPendingSchemes] = useState<Scheme[]>([]);
  const [pendingTenders, setPendingTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadPendingItems();
  }, [activeTab]);

  const loadPendingItems = async () => {
    setLoading(true);
    try {
      if (activeTab === 'schemes') {
        const res = await adminService.getPendingSchemes();
        if (res.success && res.data) {
          setPendingSchemes(res.data.content);
        }
      } else {
        const res = await adminService.getPendingTenders();
        if (res.success && res.data) {
          setPendingTenders(res.data.content);
        }
      }
    } catch (err) {
      console.error('Error loading pending items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveScheme = async (id: number) => {
    setActionId(id);
    try {
      const res = await adminService.approveScheme(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Scheme approved and published live to users!' });
        loadPendingItems();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to approve scheme.' });
    } finally {
      setActionId(null);
    }
  };

  const handleRejectScheme = async (id: number) => {
    setActionId(id);
    try {
      const res = await adminService.rejectScheme(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Scheme rejected.' });
        loadPendingItems();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to reject scheme.' });
    } finally {
      setActionId(null);
    }
  };

  const handleApproveTender = async (id: number) => {
    setActionId(id);
    try {
      const res = await adminService.approveTender(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Tender approved and published live to users!' });
        loadPendingItems();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to approve tender.' });
    } finally {
      setActionId(null);
    }
  };

  const handleRejectTender = async (id: number) => {
    setActionId(id);
    try {
      const res = await adminService.rejectTender(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Tender rejected.' });
        loadPendingItems();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to reject tender.' });
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
          <Clock className="w-4 h-4" /> Admin Verification & Review Queue
        </div>
        <h1 className="text-2xl font-black text-slate-900">Imported Data Review Queue</h1>
        <p className="text-xs text-slate-500">
          Review, edit, and approve imported government schemes and procurement tenders fetched from official data APIs before publishing them live to MSMEs and users.
        </p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 gap-4 pb-3">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('schemes')}
            className={`pb-2 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'schemes' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" /> Pending Schemes ({pendingSchemes.length})
          </button>
          <button
            onClick={() => setActiveTab('tenders')}
            className={`pb-2 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'tenders' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" /> Pending Tenders ({pendingTenders.length})
          </button>
        </div>

        {((activeTab === 'schemes' && pendingSchemes.length > 0) || (activeTab === 'tenders' && pendingTenders.length > 0)) && (
          <button
            onClick={async () => {
              setLoading(true);
              try {
                if (activeTab === 'schemes') {
                  for (const s of pendingSchemes) {
                    await adminService.approveScheme(s.id);
                  }
                  setAlert({ type: 'success', message: `Bulk approved and published all ${pendingSchemes.length} pending schemes!` });
                } else {
                  for (const t of pendingTenders) {
                    await adminService.approveTender(t.id);
                  }
                  setAlert({ type: 'success', message: `Bulk approved and published all ${pendingTenders.length} pending tenders!` });
                }
                loadPendingItems();
              } catch (err) {
                setAlert({ type: 'error', message: 'Failed during bulk approval.' });
              } finally {
                setLoading(false);
              }
            }}
            className="btn-primary text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" /> Bulk Approve All Pending {activeTab === 'schemes' ? 'Schemes' : 'Tenders'}
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading pending records for review..." />
      ) : activeTab === 'schemes' ? (
        pendingSchemes.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">Review Queue Empty!</h3>
            <p className="text-xs text-slate-500">All imported schemes have been reviewed and published.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      PENDING REVIEW • {scheme.schemeType}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{scheme.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{scheme.shortDescription || scheme.description}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">ID: {scheme.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Department / Ministry</span>
                    <strong className="text-slate-800">{scheme.department}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">State / Region</span>
                    <strong className="text-slate-800">{scheme.state}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Source Attribution</span>
                    <strong className="text-blue-700">{scheme.sourceName || 'API Integration'}</strong>
                  </div>
                </div>

                {scheme.officialApplicationUrl && (
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <span>Official Portal:</span>
                    <a
                      href={scheme.officialApplicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      {scheme.officialApplicationUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    onClick={() => handleRejectScheme(scheme.id)}
                    disabled={actionId === scheme.id}
                    className="btn-secondary text-xs py-2 px-4 text-rose-600 hover:bg-rose-50 border-rose-200"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleApproveScheme(scheme.id)}
                    disabled={actionId === scheme.id}
                    className="btn-primary text-xs py-2 px-5 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve & Publish Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : pendingTenders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Review Queue Empty!</h3>
          <p className="text-xs text-slate-500">All imported tenders have been reviewed and published.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingTenders.map((tender) => (
            <div key={tender.id} className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    PENDING REVIEW • TENDER #{tender.tenderNumber}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{tender.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{tender.description}</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">ID: {tender.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Organization</span>
                  <strong className="text-slate-800">{tender.organization}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Estimated Value</span>
                  <strong className="text-emerald-700">
                    {tender.estimatedValue ? `₹${(tender.estimatedValue / 100000).toFixed(1)} Lakhs` : 'N/A'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Closing Date</span>
                  <strong className="text-slate-800">
                    {tender.closingDate ? new Date(tender.closingDate).toLocaleDateString() : 'N/A'}
                  </strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => handleRejectTender(tender.id)}
                  disabled={actionId === tender.id}
                  className="btn-secondary text-xs py-2 px-4 text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => handleApproveTender(tender.id)}
                  disabled={actionId === tender.id}
                  className="btn-primary text-xs py-2 px-5 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-4 h-4" /> Approve & Publish Live
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
