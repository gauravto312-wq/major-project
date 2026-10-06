import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schemeService } from '../../services/schemeService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { SchemeAssistantDto, ApplicationStatus } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { openExternalUrl } from '../../utils/urlUtils';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  Clock,
  Building2,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Globe,
  Info,
  Send,
} from 'lucide-react';

export const ApplicationAssistantPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, user } = useAuth();

  const [assistant, setAssistant] = useState<SchemeAssistantDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingTracker, setUpdatingTracker] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    if (slug) {
      loadAssistantData();
    }
  }, [slug]);

  const loadAssistantData = async () => {
    setLoading(true);
    try {
      const res = await schemeService.getAssistantSummaryBySlug(slug!);
      if (res.success) {
        setAssistant(res.data);
      }
    } catch (err) {
      console.error('Error loading assistant summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracker = async (status: ApplicationStatus) => {
    if (!assistant) return;
    if (!isAuthenticated) {
      setAlertMsg({ type: 'info', text: 'Please login to track this scheme application.' });
      return;
    }

    setUpdatingTracker(true);
    setAlertMsg(null);
    try {
      const res = await applicationService.trackApplication({
        schemeId: assistant.schemeId,
        title: assistant.schemeTitle,
        status: status,
        notes: `Application status updated to ${status} via Scheme Application Guide`,
      });
      if (res.success) {
        setAssistant((prev) => (prev ? { ...prev, currentTrackerStatus: status } : prev));
        setAlertMsg({
          type: 'success',
          text: `Application status updated to "${status}" in your Application Tracker!`,
        });
      }
    } catch (err) {
      console.error('Failed to update tracker status:', err);
      setAlertMsg({ type: 'error', text: 'Could not update tracker status. Please try again.' });
    } finally {
      setUpdatingTracker(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading scheme application guide & official guidelines..." />;
  }

  if (!assistant) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#172033]">Application Guide Unavailable</h2>
        <p className="text-xs text-[#5E6B7D]">The scheme application guide could not be loaded.</p>
        <Link to="/schemes" className="btn-primary text-xs">
          Return to Schemes Portal
        </Link>
      </div>
    );
  }

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'ELIGIBLE':
        return (
          <span className="bg-[#EBF7F0] text-[#1B8354] border border-[#A3D9BD] text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#1B8354]" /> Eligible
          </span>
        );
      case 'LIKELY_ELIGIBLE':
        return (
          <span className="bg-[#FEF7E6] text-[#B7791F] border border-[#F8D88E] text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#C89B3C]" /> Likely Eligible
          </span>
        );
      case 'NEEDS_VERIFICATION':
        return (
          <span className="bg-[#E5EEF9] text-[#173B72] border border-[#C7DBF2] text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <HelpCircle className="w-4 h-4 text-[#173B72]" /> Needs Profile Verification
          </span>
        );
      default:
        return (
          <span className="bg-[#FDF2F2] text-[#C53030] border border-[#F7A3A3] text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <XCircle className="w-4 h-4 text-[#C53030]" /> Criteria Mismatch
          </span>
        );
    }
  };

  const getApplicationModeBadge = (mode: string) => {
    switch (mode?.toUpperCase()) {
      case 'ONLINE':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded">Mode: Apply Online</span>;
      case 'OFFLINE':
        return <span className="bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded">Mode: Apply Offline (In-Person / Postal)</span>;
      case 'BOTH':
        return <span className="bg-blue-50 text-blue-800 border border-blue-300 text-[11px] font-bold px-2.5 py-0.5 rounded">Mode: Online & Offline Options</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-bold px-2.5 py-0.5 rounded">Mode: Refer Official Guidelines</span>;
    }
  };

  const hasDirectAppUrl = Boolean(assistant.officialApplicationUrl && assistant.officialApplicationUrl.trim());
  const hasOfficialSourceUrl = Boolean(assistant.officialSourceUrl && assistant.officialSourceUrl.trim());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#5E6B7D]">
          <Link to="/" className="hover:text-[#173B72] font-medium">Home</Link>
          <span>/</span>
          <Link to="/schemes" className="hover:text-[#173B72] font-medium">Schemes</Link>
          <span>/</span>
          <Link to={`/schemes/${assistant.slug}`} className="hover:text-[#173B72] font-medium truncate max-w-xs">{assistant.schemeTitle}</Link>
          <span>/</span>
          <span className="text-[#173B72] font-bold">Application Guide</span>
        </nav>

        <Link
          to={`/schemes/${assistant.slug}`}
          className="text-xs text-[#173B72] font-bold hover:underline flex items-center gap-1"
        >
          View Full Scheme Notice
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {alertMsg && (
        <Alert type={alertMsg.type} message={alertMsg.text} onClose={() => setAlertMsg(null)} />
      )}

      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-[#173B72] via-[#1E4B8F] to-[#2456A6] text-white p-6 sm:p-8 rounded-3xl shadow-gov-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-[#C89B3C]/50">
                <BookOpen className="w-5 h-5 text-[#C89B3C]" />
              </div>
              <span className="text-xs font-bold text-[#F3E8D0] uppercase tracking-wider">
                Scheme Application Guide
              </span>
            </div>

            <div className="flex items-center gap-2">
              {getRatingBadge(assistant.eligibilityRating)}
              {assistant.daysRemaining !== null && assistant.daysRemaining !== undefined && (
                <span className="bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#F3E8D0]" />
                  {assistant.daysRemaining > 0 ? `${assistant.daysRemaining} days left` : 'Deadline Passed'}
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">
            {assistant.schemeTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#F3E8D0]/90 leading-relaxed">
            Here's exactly how to apply for this scheme. Review eligibility, gather required documents, follow step-by-step instructions, visit the official government website, and open the direct application page.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/90 pt-1">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#C89B3C]" />
              {assistant.department || 'Government Department'}
            </span>
            <span>•</span>
            {getApplicationModeBadge(assistant.applicationMode)}
            {assistant.currentTrackerStatus !== 'NOT_TRACKED' && (
              <>
                <span>•</span>
                <span className="bg-[#C89B3C]/20 border border-[#C89B3C] text-white px-2.5 py-0.5 rounded text-[11px] font-bold">
                  Tracker Status: {assistant.currentTrackerStatus}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main 6 Guidance Steps */}
      <div className="space-y-8">
        
        {/* STEP 1: CHECK ELIGIBILITY */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#173B72] uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#173B72] text-white text-xs flex items-center justify-center font-bold">1</span>
              Step 1 — Check Scheme Eligibility
            </h2>
            {!user && (
              <Link to="/login" className="text-xs text-[#2456A6] font-semibold hover:underline">
                Login to check matching profile parameters
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assistant.eligibilityChecks.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-[#F5F7FA] space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[#172033]">{item.criterion}</span>
                  {item.passed ? (
                    <span className="text-[10px] font-bold bg-[#EBF7F0] text-[#1B8354] border border-[#A3D9BD] px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Match
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-[#FEF7E6] text-[#B7791F] border border-[#F8D88E] px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Review
                    </span>
                  )}
                </div>
                <div className="text-[#5E6B7D] leading-relaxed">{item.message}</div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  Profile parameter: <strong>{item.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 2: REVIEW REQUIRED DOCUMENTS (Informational Only) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#173B72] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#173B72] text-white text-xs flex items-center justify-center font-bold">2</span>
                Step 2 — Review Required Documents
              </h2>
              <p className="text-xs text-[#5E6B7D] mt-0.5">
                Gather these required & optional documents before accessing the official government portal.
              </p>
            </div>
            <span className="text-xs font-bold text-[#173B72] bg-[#E5EEF9] px-3 py-1 rounded-md border border-[#C7DBF2]">
              Informational Checklist
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assistant.requiredDocumentsList && assistant.requiredDocumentsList.length > 0 ? (
              assistant.requiredDocumentsList.map((doc, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                    doc.required ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="mt-0.5">
                    {doc.required ? (
                      <CheckCircle2 className="w-4 h-4 text-[#1B8354] shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    )}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#172033]">{doc.documentName}</span>
                      {doc.required ? (
                        <span className="text-[10px] font-bold text-[#1B8354] bg-[#EBF7F0] px-2 py-0.5 rounded border border-[#A3D9BD] uppercase">
                          Required
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#B7791F] bg-[#FEF7E6] px-2 py-0.5 rounded border border-[#F8D88E] uppercase">
                          Optional
                        </span>
                      )}
                    </div>
                    {doc.notes && <div className="text-[11px] text-[#5E6B7D]">{doc.notes}</div>}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-xs text-[#5E6B7D] italic">
                Standard identity & business documents required (Aadhaar Card, PAN Card, UDYAM Registration, GST Certificate). Refer to official portal guidelines.
              </div>
            )}
          </div>
        </div>

        {/* STEP 3: FOLLOW APPLICATION PROCESS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#173B72] uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#173B72] text-white text-xs flex items-center justify-center font-bold">3</span>
              Step 3 — Follow Application Process
            </h2>
            <p className="text-xs text-[#5E6B7D] mt-0.5">
              Step-by-step guidance for completing your application on the official ministry portal.
            </p>
          </div>

          <div className="space-y-3">
            {assistant.applicationSteps.map((stepText, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-[#F5F7FA] flex items-start gap-3 text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#173B72] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div className="font-semibold text-[#172033] leading-relaxed pt-0.5">
                  {stepText}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 4: OFFICIAL GOVERNMENT WEBSITE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#173B72] uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#173B72] text-white text-xs flex items-center justify-center font-bold">4</span>
              Step 4 — Official Government Website
            </h2>
            <p className="text-xs text-[#5E6B7D] mt-0.5">
              Government scheme information, official guidelines, eligibility notifications, and ministry contact points.
            </p>
          </div>

          {hasOfficialSourceUrl ? (
            <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-[#172033] text-xs flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#173B72]" /> Official Government Source Site
                </div>
                <div className="text-[11px] text-[#5E6B7D] truncate max-w-md">
                  {assistant.officialSourceUrl}
                </div>
              </div>

              <button
                type="button"
                onClick={() => openExternalUrl(assistant.officialSourceUrl!)}
                className="btn-secondary py-2.5 px-5 text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto shrink-0"
              >
                Open Official Government Website
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#5E6B7D]">
              Official government website link is not specified for this record.
            </div>
          )}
        </div>

        {/* STEP 5: DIRECT APPLICATION PAGE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#173B72] uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#173B72] text-white text-xs flex items-center justify-center font-bold">5</span>
              Step 5 — Direct Application Page
            </h2>
            <p className="text-xs text-[#5E6B7D] mt-0.5">
              Start your actual online application, form submission, or portal login directly on the government application endpoint.
            </p>
          </div>

          {hasDirectAppUrl ? (
            assistant.applicationDestinationStatus === 'APPLICATION_LOGIN' ? (
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-amber-700" /> Government Application Portal (Login Required)
                  </div>
                  <div className="text-[11px] text-slate-600 truncate max-w-md font-mono">
                    {assistant.officialApplicationUrl}
                  </div>
                  <div className="text-[10px] text-amber-800">
                    This government portal requires you to log in or register before starting the application.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    openExternalUrl(assistant.officialApplicationUrl!);
                    if (assistant.currentTrackerStatus === 'NOT_TRACKED' || assistant.currentTrackerStatus === 'INTERESTED') {
                      handleUpdateTracker('PREPARING');
                    }
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-gov w-full sm:w-auto shrink-0"
                >
                  Open Application Portal
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ) : assistant.applicationDestinationStatus === 'PORTAL_REQUIRES_NAVIGATION' ? (
              <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-blue-700" /> Government Application Portal
                  </div>
                  <div className="text-[11px] text-slate-600 truncate max-w-md font-mono">
                    {assistant.officialApplicationUrl}
                  </div>
                  <div className="text-[10px] text-blue-800">
                    Access the main portal and follow the navigation steps in Step 3 to reach your application form.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    openExternalUrl(assistant.officialApplicationUrl!);
                    if (assistant.currentTrackerStatus === 'NOT_TRACKED' || assistant.currentTrackerStatus === 'INTERESTED') {
                      handleUpdateTracker('PREPARING');
                    }
                  }}
                  className="bg-[#173B72] hover:bg-[#2456A6] text-white py-3 px-6 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-gov w-full sm:w-auto shrink-0"
                >
                  Open Official Application Portal
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#EBF7F0]/60 border border-[#A3D9BD] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-[#1B8354] text-xs flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-[#1B8354]" /> Verified Direct Application Page
                  </div>
                  <div className="text-[11px] text-[#5E6B7D] truncate max-w-md font-mono">
                    {assistant.officialApplicationUrl}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Opens actual online application portal directly in a new browser tab.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    openExternalUrl(assistant.officialApplicationUrl!);
                    if (assistant.currentTrackerStatus === 'NOT_TRACKED' || assistant.currentTrackerStatus === 'INTERESTED') {
                      handleUpdateTracker('PREPARING');
                    }
                  }}
                  className="btn-primary py-3 px-6 text-xs font-bold flex items-center justify-center gap-2 shadow-gov w-full sm:w-auto shrink-0"
                >
                  Open Direct Application Page
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )
          ) : (
            <div className="p-4 rounded-2xl bg-[#FEF7E6] border border-[#F8D88E] text-xs space-y-2">
              <div className="font-bold text-[#B7791F] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Direct Application Page Not Available
              </div>
              <div className="text-[#5E6B7D] leading-relaxed">
                This scheme does not currently provide a stable direct application link. Please use the <strong>Official Government Website</strong> in Step 4 above to locate the scheme guidelines, regional office addresses, or online portal login.
              </div>
            </div>
          )}
        </div>

        {/* STEP 6: TRACK YOUR APPLICATION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#173B72] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#173B72] text-white text-xs flex items-center justify-center font-bold">6</span>
                Step 6 — Track Your Application
              </h2>
              <p className="text-xs text-[#5E6B7D] mt-0.5">
                Already submitted or preparing on the official portal? Keep your BizSahayak tracker updated.
              </p>
            </div>

            {assistant.currentTrackerStatus !== 'NOT_TRACKED' && (
              <span className="text-xs font-bold text-[#1B8354] bg-[#EBF7F0] px-3 py-1 rounded-md border border-[#A3D9BD]">
                Current Tracker Status: {assistant.currentTrackerStatus}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleUpdateTracker('PREPARING')}
              disabled={updatingTracker}
              className="btn-secondary py-2.5 px-5 text-xs font-bold"
            >
              Keep Preparing
            </button>

            <button
              type="button"
              onClick={() => handleUpdateTracker('APPLIED')}
              disabled={updatingTracker}
              className="bg-[#1B8354] hover:bg-[#156943] text-white py-2.5 px-6 text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Mark as Applied
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
