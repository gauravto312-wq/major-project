import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { schemeService } from '../../services/schemeService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { Scheme } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { Badge } from '../../components/Badge';
import { getSchemeApplyUrl, getSchemeSourceUrl, normalizeExternalUrl } from '../../utils/urlUtils';
import {
  Building2,
  Calendar,
  ExternalLink,
  MapPin,
  CheckCircle2,
  FileCheck,
  Award,
  Clock,
  PlusCircle,
  Landmark,
  Sparkles,
  Zap,
} from 'lucide-react';

export const SchemeDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingSuccess, setTrackingSuccess] = useState<string | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      loadScheme();
    }
  }, [slug]);

  const loadScheme = async () => {
    setLoading(true);
    try {
      const res = await schemeService.getSchemeBySlug(slug!);
      if (res.success) {
        setScheme(res.data);
      }
    } catch (err) {
      console.error('Error loading scheme details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackApplication = async () => {
    if (!scheme) return;
    setTrackingLoading(true);
    setTrackingError(null);
    setTrackingSuccess(null);
    try {
      const res = await applicationService.trackApplication({
        schemeId: scheme.id,
        title: scheme.title,
        status: 'INTERESTED',
        notes: `Interested in ${scheme.title}`,
      });
      if (res.success) {
        setTrackingSuccess('Scheme added to your Application Tracker! View status under My Applications.');
      } else {
        setTrackingError('Failed to add to Application Tracker.');
      }
    } catch (err: any) {
      console.error('Error tracking application:', err);
      setTrackingError('Unable to record application interest. Please try again.');
    } finally {
      setTrackingLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading scheme details from official repository..." />;
  }

  if (!scheme) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#172033]">Scheme Not Found</h2>
        <p className="text-xs text-[#5E6B7D]">The requested scheme could not be found or may have been archived.</p>
        <Link to="/schemes" className="btn-primary text-xs">
          Browse All Schemes
        </Link>
      </div>
    );
  }

  const applyUrl = getSchemeApplyUrl(scheme);
  const sourceUrl = getSchemeSourceUrl(scheme);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#5E6B7D]">
          <Link to="/" className="hover:text-[#173B72] font-medium">Home</Link>
          <span>/</span>
          <Link to="/schemes" className="hover:text-[#173B72] font-medium">Schemes</Link>
          <span>/</span>
          <span className="text-[#173B72] font-bold truncate max-w-xs">{scheme.title}</span>
        </nav>
        <Badge status={scheme.status} />
      </div>

      {trackingSuccess && (
        <Alert type="success" message={trackingSuccess} onClose={() => setTrackingSuccess(null)} />
      )}
      {trackingError && (
        <Alert type="error" message={trackingError} onClose={() => setTrackingError(null)} />
      )}

      {/* Main Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-gov space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#E5EEF9] text-[#173B72] border border-[#C7DBF2] text-xs font-bold px-3 py-1 rounded-md">
              {scheme.schemeType}
            </span>
            {scheme.categoryName && (
              <span className="bg-[#F3E8D0] text-[#173B72] border border-[#D8C39A] text-xs font-semibold px-3 py-1 rounded-md">
                {scheme.categoryName}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#172033] leading-snug">
            {scheme.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#5E6B7D] pt-1">
            <div className="flex items-center gap-1.5 font-medium">
              <Building2 className="w-4 h-4 text-[#173B72]" />
              <span>{scheme.department}</span>
              {scheme.ministry && <span className="text-slate-400">({scheme.ministry})</span>}
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[#1B8354]" />
              <span>{scheme.state}</span>
            </div>

            {scheme.deadline && (
              <div className="flex items-center gap-1.5 font-medium text-[#B7791F] bg-[#FEF7E6] px-2.5 py-1 rounded-md border border-[#F8D88E]">
                <Clock className="w-4 h-4 text-[#B7791F]" />
                <span>Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Short Summary Box */}
        {scheme.shortDescription && (
          <div className="bg-[#F5F7FA] p-4 rounded-2xl border border-slate-200 text-xs text-[#172033] leading-relaxed font-medium">
            {scheme.shortDescription}
          </div>
        )}

        {/* Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {applyUrl && (
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-3 px-5 text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto bg-[#173B72] hover:bg-[#2456A6]"
              >
                Direct Application Page
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-[#172033] border border-slate-300 py-3 px-5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
              >
                Official Government Website
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>
            )}

            <button
              type="button"
              onClick={() => navigate(`/schemes/${scheme.slug}/assistant`)}
              className="bg-[#173B72] hover:bg-[#2456A6] text-white py-3 px-5 text-xs font-bold rounded-xl border border-[#C89B3C]/50 flex items-center justify-center gap-2 shadow-xs transition-colors w-full sm:w-auto"
            >
              <Zap className="w-4 h-4 text-[#C89B3C]" />
              Launch Application Guide
            </button>
          </div>

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleTrackApplication}
              disabled={trackingLoading}
              className="btn-secondary py-3 px-5 text-xs font-bold w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4 text-[#173B72]" />
              {trackingLoading ? 'Adding...' : 'Track My Application Activity'}
            </button>
          )}
        </div>

        {/* Official Disclaimer Note */}
        <div className="text-[11px] text-[#5E6B7D] bg-[#F5F7FA] p-3 rounded-xl border border-slate-200/80 leading-relaxed">
          <strong>Notice:</strong> BizSahayak provides verified scheme metadata. Official applications, document verification, and final disbursement are executed strictly through the official government portal.
        </div>
      </div>

      {/* Structured Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content (2 Cols) */}
        <div className="md:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-3">
            <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#173B72]" />
              Detailed Scheme Overview
            </h3>
            <p className="text-xs text-[#5E6B7D] leading-relaxed whitespace-pre-line">
              {scheme.description}
            </p>
          </div>

          {/* Benefits */}
          {scheme.benefits && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-3">
              <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#1B8354]" />
                Key Financial Benefits & Incentives
              </h3>
              <p className="text-xs text-[#172033] leading-relaxed whitespace-pre-line bg-[#EBF7F0]/60 p-4 rounded-xl border border-[#A3D9BD]">
                {scheme.benefits}
              </p>
            </div>
          )}

          {/* Application Process */}
          {scheme.applicationProcess && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-3">
              <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#173B72]" />
                Step-by-Step Application Process
              </h3>
              <p className="text-xs text-[#5E6B7D] leading-relaxed whitespace-pre-line">
                {scheme.applicationProcess}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info (1 Col) */}
        <div className="space-y-6">
          {/* Eligibility Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-3">
            <h3 className="text-xs font-bold text-[#173B72] uppercase tracking-wider">Eligibility Criteria</h3>
            <div className="text-xs text-[#5E6B7D] leading-relaxed whitespace-pre-line">
              {scheme.eligibility || 'Refer to official scheme guidelines for full eligibility specifications.'}
            </div>
          </div>

          {/* Required Documents Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-3">
            <h3 className="text-xs font-bold text-[#173B72] uppercase tracking-wider">Required Documents</h3>
            <div className="text-xs text-[#5E6B7D] leading-relaxed whitespace-pre-line">
              {scheme.requiredDocuments || 'Aadhaar, PAN, Bank Statements, Project Report.'}
            </div>
          </div>

          {/* Target Parameters & Source Transparency */}
          <div className="bg-[#F5F7FA] p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
            <h3 className="font-bold text-[#172033]">Target Enterprise Metrics</h3>
            {scheme.targetIndustries && (
              <div>
                <span className="text-[#5E6B7D] block text-[11px]">Industries:</span>
                <span className="font-semibold text-[#172033]">{scheme.targetIndustries}</span>
              </div>
            )}
            {scheme.targetBusinessTypes && (
              <div>
                <span className="text-[#5E6B7D] block text-[11px]">Business Entities:</span>
                <span className="font-semibold text-[#172033]">{scheme.targetBusinessTypes}</span>
              </div>
            )}

            {/* Source Transparency Box */}
            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-[11px]">
              <span className="font-bold text-[#173B72] uppercase tracking-wider text-[10px] block">Government Data Transparency:</span>
              <div>
                <span className="text-[#5E6B7D]">Official Provider: </span>
                <strong className="text-[#173B72]">{scheme.sourceName || 'Government of India'}</strong>
              </div>
              {scheme.lastSyncedAt && (
                <div>
                  <span className="text-[#5E6B7D]">Last Synced: </span>
                  <strong className="text-[#172033]">{new Date(scheme.lastSyncedAt).toLocaleDateString()}</strong>
                </div>
              )}
              {scheme.officialSourceUrl && (
                <div className="pt-1">
                  <a
                    href={scheme.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#173B72] font-bold hover:underline flex items-center gap-1 text-xs"
                  >
                    Official Government Source Link
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
