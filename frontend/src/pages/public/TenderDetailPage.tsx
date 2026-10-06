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
  ShieldCheck,
} from 'lucide-react';

export const TenderDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingSuccess, setTrackingSuccess] = useState<string | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);
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
    setTrackingError(null);
    setTrackingSuccess(null);
    try {
      const res = await applicationService.trackApplication({
        tenderId: tender.id,
        title: tender.title,
        status: 'INTERESTED',
        notes: `Tracking Tender: ${tender.tenderNumber}`,
      });
      if (res.success) {
        setTrackingSuccess('Tender added to your Application Tracker! View status under My Applications.');
      } else {
        setTrackingError('Failed to record tender interest.');
      }
    } catch (err: any) {
      console.error('Error tracking tender:', err);
      setTrackingError('Unable to record application interest. Please try again.');
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
    return <LoadingSpinner message="Loading procurement notice from repository..." />;
  }

  if (!tender) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#172033]">Tender Not Found</h2>
        <p className="text-xs text-[#5E6B7D]">The requested procurement tender could not be found or has closed.</p>
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
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#5E6B7D]">
          <Link to="/" className="hover:text-[#173B72] font-medium">Home</Link>
          <span>/</span>
          <Link to="/tenders" className="hover:text-[#173B72] font-medium">Tenders</Link>
          <span>/</span>
          <span className="text-[#173B72] font-bold truncate max-w-xs">{tender.tenderNumber}</span>
        </nav>
        <Badge status={tender.status} />
      </div>

      {trackingSuccess && (
        <Alert type="success" message={trackingSuccess} onClose={() => setTrackingSuccess(null)} />
      )}
      {trackingError && (
        <Alert type="error" message={trackingError} onClose={() => setTrackingError(null)} />
      )}

      {/* Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-gov space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#E5EEF9] text-[#173B72] border border-[#C7DBF2] text-xs font-mono font-bold px-3 py-1 rounded-md">
              Tender Ref: {tender.tenderNumber}
            </span>
            {tender.categoryName && (
              <span className="bg-[#F3E8D0] text-[#173B72] border border-[#D8C39A] text-xs font-semibold px-3 py-1 rounded-md">
                {tender.categoryName}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#172033] leading-snug">
            {tender.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#5E6B7D] pt-1">
            <div className="flex items-center gap-1.5 font-medium">
              <Building2 className="w-4 h-4 text-[#173B72]" />
              <span>{tender.organization}</span>
              {tender.department && <span className="text-slate-400">({tender.department})</span>}
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[#1B8354]" />
              <span>{tender.location ? `${tender.location}, ${tender.state}` : tender.state}</span>
            </div>

            {tender.closingDate && (
              <div className="flex items-center gap-1.5 font-medium text-[#C53030] bg-[#FDF2F2] px-2.5 py-1 rounded-md border border-[#F7A3A3]">
                <Clock className="w-4 h-4 text-[#C53030]" />
                <span>Closing Date: {new Date(tender.closingDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Estimated Value Banner */}
        <div className="bg-[#F5F7FA] p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-[#173B72] uppercase tracking-wider">Estimated Project Value</span>
          <span className="text-xl font-black text-[#173B72] flex items-center font-mono">
            <IndianRupee className="w-5 h-5 text-[#1B8354] mr-1" />
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
              className="btn-primary py-3 px-6 text-xs font-bold w-full sm:w-auto"
            >
              View Tender on Official Portal (eProcure / GeM)
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div className="text-xs text-[#5E6B7D] font-medium">
              Official tender bidding on government portal.
            </div>
          )}

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleTrackTender}
              disabled={trackingLoading}
              className="btn-secondary py-3 px-5 text-xs font-bold w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4 text-[#173B72]" />
              {trackingLoading ? 'Adding...' : 'Track Tender Preparation'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-3">
            <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#173B72]" />
              Tender Description & Scope of Work
            </h3>
            <p className="text-xs text-[#5E6B7D] leading-relaxed whitespace-pre-line">
              {tender.description}
            </p>
          </div>

          {tender.requirements && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-3">
              <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#1B8354]" />
                Technical Requirements & Compliance
              </h3>
              <p className="text-xs text-[#172033] leading-relaxed whitespace-pre-line bg-[#F5F7FA] p-4 rounded-xl border border-slate-200">
                {tender.requirements}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-3">
            <h3 className="text-xs font-bold text-[#173B72] uppercase tracking-wider">Bidder Eligibility</h3>
            <div className="text-xs text-[#5E6B7D] leading-relaxed whitespace-pre-line">
              {tender.eligibility || 'Refer to tender notice document for full bidder eligibility.'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-3">
            <h3 className="text-xs font-bold text-[#173B72] uppercase tracking-wider">Required Submission Documents</h3>
            <div className="text-xs text-[#5E6B7D] leading-relaxed whitespace-pre-line">
              {tender.requiredDocuments || 'GST Certificate, Audited Balance Sheet, Turnover Certificate, Technical Bids.'}
            </div>
          </div>

          <div className="bg-[#F5F7FA] p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-[#173B72] uppercase tracking-wider text-[10px] block">Government Data Transparency:</span>
            <div>
              <span className="text-[#5E6B7D]">Official Source: </span>
              <strong className="text-[#173B72]">{tender.sourceName || 'Data.gov.in / CPPP'}</strong>
            </div>
            {tender.lastSyncedAt && (
              <div>
                <span className="text-[#5E6B7D]">Last Synced: </span>
                <strong className="text-[#172033]">{new Date(tender.lastSyncedAt).toLocaleDateString()}</strong>
              </div>
            )}
            {tender.officialSourceUrl && (
              <div className="pt-1">
                <a
                  href={tender.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#173B72] font-bold hover:underline flex items-center gap-1 text-xs"
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
