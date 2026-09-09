import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { BusinessProfile, BusinessDocument } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Alert } from '../../components/Alert';
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  FileText,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
} from 'lucide-react';

export const AdminBusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [documents, setDocuments] = useState<BusinessDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Action Modals State
  const [activeModal, setActiveModal] = useState<'APPROVE' | 'REJECT' | 'CORRECTION' | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  useEffect(() => {
    if (id) {
      loadBusinessDetails();
    }
  }, [id]);

  const loadBusinessDetails = async () => {
    setLoading(true);
    try {
      const [bizRes, docRes] = await Promise.all([
        adminService.getBusinessById(Number(id)),
        adminService.getBusinessDocuments(Number(id)),
      ]);

      if (bizRes.success) setBusiness(bizRes.data);
      if (docRes.success) setDocuments(docRes.data);
    } catch (err) {
      console.error('Error loading business details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!business) return;
    setActionLoading(true);
    try {
      const res = await adminService.approveBusiness(business.id!, reasonInput);
      if (res.success) {
        setBusiness(res.data);
        setAlert({ type: 'success', message: 'Business verification APPROVED successfully!' });
        setActiveModal(null);
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: 'Failed to approve verification.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!business || !reasonInput.trim()) return;
    setActionLoading(true);
    try {
      const res = await adminService.rejectBusiness(business.id!, reasonInput);
      if (res.success) {
        setBusiness(res.data);
        setAlert({ type: 'success', message: 'Business verification REJECTED.' });
        setActiveModal(null);
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: 'Failed to reject verification.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCorrection = async () => {
    if (!business || !reasonInput.trim()) return;
    setActionLoading(true);
    try {
      const res = await adminService.requestCorrection(business.id!, reasonInput);
      if (res.success) {
        setBusiness(res.data);
        setAlert({ type: 'success', message: 'Correction request sent to business.' });
        setActiveModal(null);
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: 'Failed to send correction request.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading business verification payload..." />;
  }

  if (!business) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Business Profile Not Found</h2>
        <Link to="/admin/businesses/pending" className="btn-primary text-xs">Back to Applications</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Nav & Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link to="/admin/businesses/pending" className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Verification List
        </Link>
        <Badge status={business.verificationStatus} />
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Main Review Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900">{business.businessName}</h1>
            <p className="text-xs font-semibold text-blue-600">
              {business.businessType} • {business.industry}
            </p>
          </div>

          {/* Action Decision Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setReasonInput(''); setActiveModal('APPROVE'); }}
              className="btn-success text-xs py-2 px-4"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve
            </button>
            <button
              onClick={() => { setReasonInput(''); setActiveModal('CORRECTION'); }}
              className="btn-primary bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs py-2 px-4"
            >
              <AlertTriangle className="w-4 h-4" /> Request Correction
            </button>
            <button
              onClick={() => { setReasonInput(''); setActiveModal('REJECT'); }}
              className="btn-danger text-xs py-2 px-4"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </div>
        </div>

        {/* Business Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
          <div>
            <span className="text-slate-400 block font-medium uppercase text-[10px]">Location</span>
            <span className="font-bold text-slate-800">{business.district}, {business.state}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium uppercase text-[10px]">Turnover Range</span>
            <span className="font-bold text-slate-800">{business.turnoverRange || 'Not Specified'}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium uppercase text-[10px]">Investment Range</span>
            <span className="font-bold text-slate-800">{business.investmentRange || 'Not Specified'}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium uppercase text-[10px]">Employee Count</span>
            <span className="font-bold text-slate-800">{business.employeeCount || '1-10'}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium uppercase text-[10px]">Business Email</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {business.businessEmail || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium uppercase text-[10px]">Phone</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {business.phone || 'N/A'}
            </span>
          </div>
        </div>

        {/* Business Description */}
        {business.businessDescription && (
          <div className="space-y-1 text-xs">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Business Description</span>
            <p className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
              {business.businessDescription}
            </p>
          </div>
        )}
      </div>

      {/* Submitted Documents Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Submitted Business Verification Documents ({documents.length})
        </h2>

        {documents.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{doc.documentType}</span>
                  <span className="text-slate-500 font-mono">{doc.fileName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={doc.status} />
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary py-1.5 px-3 text-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> View File
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
            No verification documents uploaded yet by business.
          </div>
        )}
      </div>

      {/* Action Decision Dialog Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              {activeModal === 'APPROVE' && 'Approve Business Verification'}
              {activeModal === 'REJECT' && 'Reject Business Verification'}
              {activeModal === 'CORRECTION' && 'Request Correction from Business'}
            </h3>

            {(activeModal === 'REJECT' || activeModal === 'CORRECTION') && (
              <div>
                <label className="label-field">Reason / Admin Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide specific feedback or reasons for the business owner..."
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="input-field"
                ></textarea>
              </div>
            )}

            {activeModal === 'APPROVE' && (
              <p className="text-xs text-slate-600">
                Are you sure you want to mark <strong>{business.businessName}</strong> as VERIFIED? This will unlock full recommendation access for the business.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="btn-secondary text-xs">
                Cancel
              </button>
              {activeModal === 'APPROVE' && (
                <button onClick={handleApprove} disabled={actionLoading} className="btn-success text-xs">
                  {actionLoading ? 'Approving...' : 'Confirm Approve'}
                </button>
              )}
              {activeModal === 'REJECT' && (
                <button
                  onClick={handleReject}
                  disabled={actionLoading || !reasonInput.trim()}
                  className="btn-danger text-xs"
                >
                  {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
                </button>
              )}
              {activeModal === 'CORRECTION' && (
                <button
                  onClick={handleCorrection}
                  disabled={actionLoading || !reasonInput.trim()}
                  className="btn-primary text-xs bg-amber-600 hover:bg-amber-700"
                >
                  {actionLoading ? 'Sending...' : 'Send Correction Request'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
