import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Scheme, Tender } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { AdminHeaderNav } from '../../components/AdminHeaderNav';
import { CheckCircle, XCircle, Clock, Building2, ExternalLink, Calendar, Layers, ShieldCheck } from 'lucide-react';

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
    <>
      <AdminHeaderNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
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
            <Clock className="w-4 h-4 text-[#C89B3C]" /> Admin Verification & Publication Queue
          </div>
          <h1 className="text-2xl font-black text-white">Imported Data Review Queue</h1>
          <p className="text-xs text-[#F5F7FA]/90">
            Review, edit, and approve imported government schemes and procurement tenders fetched from official data APIs before publishing them live to MSMEs and users.
          </p>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 gap-4 pb-3">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('schemes')}
            className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'schemes' ? 'border-[#173B72] text-[#173B72]' : 'border-transparent text-[#5E6B7D] hover:text-[#172033]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#C89B3C]" /> Pending Schemes ({pendingSchemes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tenders')}
            className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'tenders' ? 'border-[#173B72] text-[#173B72]' : 'border-transparent text-[#5E6B7D] hover:text-[#172033]'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#C89B3C]" /> Pending Tenders ({pendingTenders.length})
          </button>
        </div>

        {((activeTab === 'schemes' && pendingSchemes.length > 0) || (activeTab === 'tenders' && pendingTenders.length > 0)) && (
          <button
            type="button"
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
            className="btn-success text-xs py-2 px-4 flex items-center gap-1.5"
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
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-gov">
            <CheckCircle className="w-10 h-10 text-[#1B8354] mx-auto" />
            <h3 className="text-lg font-bold text-[#172033]">Review Queue Empty!</h3>
            <p className="text-xs text-[#5E6B7D]">All imported schemes have been reviewed and published.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-white p-6 rounded-3xl border border-[#F8D88E] shadow-gov space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B7791F] bg-[#FEF7E6] px-2 py-0.5 rounded border border-[#F8D88E]">
                      PENDING REVIEW • {scheme.schemeType}
                    </span>
                    <h3 className="text-lg font-bold text-[#172033] mt-1">{scheme.title}</h3>
                    <p className="text-xs text-[#5E6B7D] mt-0.5">{scheme.shortDescription || scheme.description}</p>
                  </div>
                  <span className="text-xs text-[#5E6B7D] font-mono">ID: {scheme.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F5F7FA] p-3 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[#5E6B7D] block text-[10px]">Department / Ministry</span>
                    <strong className="text-[#172033]">{scheme.department}</strong>
                  </div>
                  <div>
                    <span className="text-[#5E6B7D] block text-[10px]">State / Region</span>
                    <strong className="text-[#172033]">{scheme.state}</strong>
                  </div>
                  <div>
                    <span className="text-[#5E6B7D] block text-[10px]">Source Attribution</span>
                    <strong className="text-[#173B72]">{scheme.sourceName || 'API Integration'}</strong>
                  </div>
                </div>

                {scheme.officialApplicationUrl && (
                  <div className="text-xs text-[#5E6B7D] flex items-center gap-1">
                    <span>Official Portal:</span>
                    <a
                      href={scheme.officialApplicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#173B72] font-bold hover:underline flex items-center gap-0.5"
                    >
                      {scheme.officialApplicationUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => handleRejectScheme(scheme.id)}
                    disabled={actionId === scheme.id}
                    className="btn-danger text-xs py-2 px-4"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveScheme(scheme.id)}
                    disabled={actionId === scheme.id}
                    className="btn-success text-xs py-2 px-5"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve & Publish Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : pendingTenders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-gov">
          <CheckCircle className="w-10 h-10 text-[#1B8354] mx-auto" />
          <h3 className="text-lg font-bold text-[#172033]">Review Queue Empty!</h3>
          <p className="text-xs text-[#5E6B7D]">All imported procurement tenders have been reviewed and published.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingTenders.map((tender) => (
            <div key={tender.id} className="bg-white p-6 rounded-3xl border border-[#F8D88E] shadow-gov space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B7791F] bg-[#FEF7E6] px-2 py-0.5 rounded border border-[#F8D88E]">
                    PENDING REVIEW • TENDER
                  </span>
                  <h3 className="text-lg font-bold text-[#172033] mt-1">{tender.title}</h3>
                  <p className="text-xs text-[#5E6B7D] mt-0.5">{tender.description}</p>
                </div>
                <span className="text-xs text-[#5E6B7D] font-mono">Ref: {tender.tenderNumber}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F5F7FA] p-3 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[#5E6B7D] block text-[10px]">Authority</span>
                  <strong className="text-[#172033]">{tender.organization}</strong>
                </div>
                <div>
                  <span className="text-[#5E6B7D] block text-[10px]">State</span>
                  <strong className="text-[#172033]">{tender.state}</strong>
                </div>
                <div>
                  <span className="text-[#5E6B7D] block text-[10px]">Source Attribution</span>
                  <strong className="text-[#173B72]">{tender.sourceName || 'eProcure / GeM'}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleRejectTender(tender.id)}
                  disabled={actionId === tender.id}
                  className="btn-danger text-xs py-2 px-4"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveTender(tender.id)}
                  disabled={actionId === tender.id}
                  className="btn-success text-xs py-2 px-5"
                >
                  <CheckCircle className="w-4 h-4" /> Approve & Publish Live
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
};
