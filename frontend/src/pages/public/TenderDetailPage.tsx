import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tenderService } from '../../services/tenderService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { Tender } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { Badge } from '../../components/Badge';
import {
  Building2,
  Calendar,
  ExternalLink,
  MapPin,
  CheckCircle2,
  FileCheck,
  IndianRupee,
  Clock,
  PlusCircle,
} from 'lucide-react';

export const TenderDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingSuccess, setTrackingSuccess] = useState<string | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      loadTender();
    }
  }, [slug]);

  const loadTender = async () => {
    setLoading(true);
    try {
      const res = await tenderService.getTenderBySlug(slug!);
      if (res.success) {
        setTender(res.data);
      }
    } catch (err) {
      console.error('Error loading tender details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackTender = async () => {
    if (!tender) return;
    setTrackingLoading(true);
    try {
      const res = await applicationService.trackApplication({
        tenderId: tender.id,
        title: tender.title,
        status: 'INTERESTED',
        notes: `Tracking Tender: ${tender.tenderNumber}`,
      });
      if (res.success) {
        setTrackingSuccess('Tender added to your Application Tracker! View status under My Applications.');
      }
    } catch (err: any) {
      console.error('Error tracking tender:', err);
    } finally {
      setTrackingLoading(false);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Refer Tender Specification';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Crore`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading tender details..." />;
  }

  if (!tender) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Tender Not Found</h2>
        <p className="text-xs text-slate-500">The requested procurement tender could not be found or has closed.</p>
        <Link to="/tenders" className="btn-primary text-xs">
          Browse All Tenders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link to="/tenders" className="hover:text-slate-900">Tenders</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{tender.tenderNumber}</span>
        </div>
        <Badge status={tender.status} />
      </div>

      {trackingSuccess && (
        <Alert type="success" message={trackingSuccess} onClose={() => setTrackingSuccess(null)} />
      )}

      {/* Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-mono font-bold px-3 py-1 rounded-md">
              Tender Ref: {tender.tenderNumber}
            </span>
            {tender.categoryName && (
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-md">
                {tender.categoryName}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            {tender.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-1.5 font-medium">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>{tender.organization}</span>
              {tender.department && <span className="text-slate-400">({tender.department})</span>}
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{tender.location ? `${tender.location}, ${tender.state}` : tender.state}</span>
            </div>

            {tender.closingDate && (
              <div className="flex items-center gap-1.5 font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                <Clock className="w-4 h-4 text-rose-600" />
                <span>Closing Date: {new Date(tender.closingDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Estimated Value Banner */}
        <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Estimated Project Value</span>
          <span className="text-xl font-black text-indigo-950 flex items-center">
            <IndianRupee className="w-5 h-5 text-emerald-600 mr-1" />
            {formatCurrency(tender.estimatedValue)}
          </span>
        </div>

        {/* Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {tender.officialTenderUrl ? (
            <a
              href={tender.officialTenderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary py-3 px-6 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
            >
              View Tender on Official Portal (eProcure / GeM)
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              Official tender bidding on government portal.
            </div>
          )}

          {isAuthenticated && (
            <button
              onClick={handleTrackTender}
              disabled={trackingLoading}
              className="btn-secondary py-3 px-4 text-xs font-bold w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              {trackingLoading ? 'Adding...' : 'Track Tender Preparation'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              Tender Description & Scope of Work
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {tender.description}
            </p>
          </div>

          {tender.requirements && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Technical Requirements & Compliance
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                {tender.requirements}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Bidder Eligibility</h3>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {tender.eligibility || 'Refer to tender notice document for full bidder eligibility.'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Required Submission Documents</h3>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {tender.requiredDocuments || 'GST Certificate, Audited Balance Sheet, Turnover Certificate, Technical Bids.'}
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">Government Data Transparency:</span>
            <div>
              <span className="text-slate-500">Official Source: </span>
              <strong className="text-indigo-700">{tender.sourceName || 'Data.gov.in / CPPP'}</strong>
            </div>
            {tender.lastSyncedAt && (
              <div>
                <span className="text-slate-500">Last Synced: </span>
                <strong className="text-slate-700">{new Date(tender.lastSyncedAt).toLocaleDateString()}</strong>
              </div>
            )}
            {tender.officialSourceUrl && (
              <div className="pt-1">
                <a
                  href={tender.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 text-xs"
                >
                  Official Procurement Portal Link
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
