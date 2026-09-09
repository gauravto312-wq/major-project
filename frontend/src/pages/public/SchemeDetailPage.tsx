import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schemeService } from '../../services/schemeService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { Scheme } from '../../types';
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
  Award,
  Clock,
  PlusCircle,
} from 'lucide-react';

export const SchemeDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingSuccess, setTrackingSuccess] = useState<string | null>(null);
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
    try {
      const res = await applicationService.trackApplication({
        schemeId: scheme.id,
        title: scheme.title,
        status: 'INTERESTED',
        notes: `Interested in ${scheme.title}`,
      });
      if (res.success) {
        setTrackingSuccess('Scheme added to your Application Tracker! View status under My Applications.');
      }
    } catch (err: any) {
      console.error('Error tracking application:', err);
    } finally {
      setTrackingLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading scheme details..." />;
  }

  if (!scheme) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Scheme Not Found</h2>
        <p className="text-xs text-slate-500">The requested scheme could not be found or may have been archived.</p>
        <Link to="/schemes" className="btn-primary text-xs">
          Browse All Schemes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link to="/schemes" className="hover:text-slate-900">Schemes</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{scheme.title}</span>
        </div>
        <Badge status={scheme.status} />
      </div>

      {trackingSuccess && (
        <Alert type="success" message={trackingSuccess} onClose={() => setTrackingSuccess(null)} />
      )}

      {/* Main Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-md">
              {scheme.schemeType}
            </span>
            {scheme.categoryName && (
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-md">
                {scheme.categoryName}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            {scheme.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-1.5 font-medium">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>{scheme.department}</span>
              {scheme.ministry && <span className="text-slate-400">({scheme.ministry})</span>}
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{scheme.state}</span>
            </div>

            {scheme.deadline && (
              <div className="flex items-center gap-1.5 font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Short Summary Box */}
        {scheme.shortDescription && (
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed font-medium">
            {scheme.shortDescription}
          </div>
        )}

        {/* Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {scheme.officialApplicationUrl ? (
            <a
              href={scheme.officialApplicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary py-3 px-6 text-sm font-bold bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              Apply on Official Government Portal
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              Official application opens via ministry portal.
            </div>
          )}

          {isAuthenticated && (
            <button
              onClick={handleTrackApplication}
              disabled={trackingLoading}
              className="btn-secondary py-3 px-4 text-xs font-bold w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              {trackingLoading ? 'Adding...' : 'Track My Application Activity'}
            </button>
          )}
        </div>

        {/* Official Disclaimer Note */}
        <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
          <strong>Notice:</strong> BizSahayak provides verified scheme metadata. Official applications, document verification, and final disbursement are executed strictly through the official government portal.
        </div>
      </div>

      {/* Structured Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content (2 Cols) */}
        <div className="md:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              Detailed Scheme Overview
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {scheme.description}
            </p>
          </div>

          {/* Benefits */}
          {scheme.benefits && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Key Financial Benefits & Incentives
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                {scheme.benefits}
              </p>
            </div>
          )}

          {/* Application Process */}
          {scheme.applicationProcess && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                Step-by-Step Application Process
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {scheme.applicationProcess}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info (1 Col) */}
        <div className="space-y-6">
          {/* Eligibility Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Eligibility Criteria</h3>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {scheme.eligibility || 'Refer to official scheme guidelines for full eligibility specifications.'}
            </div>
          </div>

          {/* Required Documents Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Required Documents</h3>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {scheme.requiredDocuments || 'Aadhaar, PAN, Bank Statements, Project Report.'}
            </div>
          </div>

          {/* Target Parameters & Source Transparency */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
            <h3 className="font-bold text-slate-900">Target Enterprise Metrics</h3>
            {scheme.targetIndustries && (
              <div>
                <span className="text-slate-500 block text-[11px]">Industries:</span>
                <span className="font-medium text-slate-800">{scheme.targetIndustries}</span>
              </div>
            )}
            {scheme.targetBusinessTypes && (
              <div>
                <span className="text-slate-500 block text-[11px]">Business Entities:</span>
                <span className="font-medium text-slate-800">{scheme.targetBusinessTypes}</span>
              </div>
            )}

            {/* Source Transparency Box */}
            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-[11px]">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">Government Data Transparency:</span>
              <div>
                <span className="text-slate-500">Official Provider: </span>
                <strong className="text-blue-700">{scheme.sourceName || 'Government of India'}</strong>
              </div>
              {scheme.lastSyncedAt && (
                <div>
                  <span className="text-slate-500">Last Synced: </span>
                  <strong className="text-slate-700">{new Date(scheme.lastSyncedAt).toLocaleDateString()}</strong>
                </div>
              )}
              {scheme.officialSourceUrl && (
                <div className="pt-1">
                  <a
                    href={scheme.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:underline flex items-center gap-1 text-xs"
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
