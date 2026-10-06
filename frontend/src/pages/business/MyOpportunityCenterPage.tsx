import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recommendationService } from '../../services/recommendationService';
import { savedService } from '../../services/savedService';
import { applicationService } from '../../services/applicationService';
import { RecommendationResponse, Scheme, Tender, UserApplication, ApplicationStatus } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { SchemeCard } from '../../components/SchemeCard';
import { TenderCard } from '../../components/TenderCard';
import { RecommendationCard } from '../../components/RecommendationCard';
import { openExternalUrl, getSchemeApplyUrl, getTenderApplyUrl } from '../../utils/urlUtils';
import {
  Sparkles,
  Bookmark,
  FileText,
  Clock,
  Zap,
  Building2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Edit3,
  Filter,
  ArrowRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export const MyOpportunityCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'RECOMMENDED' | 'SAVED' | 'TRACKED' | 'DEADLINES'>('RECOMMENDED');

  // Data states
  const [recommendedSchemes, setRecommendedSchemes] = useState<RecommendationResponse[]>([]);
  const [recommendedTenders, setRecommendedTenders] = useState<RecommendationResponse[]>([]);
  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>([]);
  const [savedTenders, setSavedTenders] = useState<Tender[]>([]);
  const [applications, setApplications] = useState<UserApplication[]>([]);

  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Status Filter for Tracked Applications
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    loadOpportunityCenterData();
  }, []);

  const loadOpportunityCenterData = async () => {
    setLoading(true);
    try {
      const [recSchRes, recTenRes, savedSchRes, savedTenRes, appRes] = await Promise.all([
        recommendationService.getRecommendedSchemes(),
        recommendationService.getRecommendedTenders(),
        savedService.getSavedSchemes(),
        savedService.getSavedTenders(),
        applicationService.getApplications(),
      ]);

      if (recSchRes.success) setRecommendedSchemes(recSchRes.data || []);
      if (recTenRes.success) setRecommendedTenders(recTenRes.data || []);
      if (savedSchRes.success) setSavedSchemes(savedSchRes.data || []);
      if (savedTenRes.success) setSavedTenders(savedTenRes.data || []);
      if (appRes.success) setApplications(appRes.data || []);
    } catch (err) {
      console.error('Failed to load Opportunity Center data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppStatus = async (appId: number, newStatus: ApplicationStatus) => {
    try {
      const res = await applicationService.updateStatus(appId, newStatus);
      if (res.success) {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
        );
        setAlertMsg({ type: 'success', text: `Application status updated to ${newStatus}` });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update application status.' });
    }
  };

  const handleDeleteApplication = async (appId: number) => {
    try {
      await applicationService.deleteApplication(appId);
      setApplications((prev) => prev.filter((app) => app.id !== appId));
      setAlertMsg({ type: 'success', text: 'Application removed from tracker.' });
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to delete application.' });
    }
  };

  // Upcoming Deadlines derived from recommended & saved items
  const upcomingDeadlineItems = [
    ...savedSchemes.filter((s) => s.deadline).map((s) => ({
      title: s.title,
      type: 'SCHEME',
      slug: s.slug,
      department: s.department,
      deadline: s.deadline!,
      url: getSchemeApplyUrl(s),
    })),
    ...savedTenders.filter((t) => t.closingDate).map((t) => ({
      title: t.title,
      type: 'TENDER',
      slug: t.slug,
      department: t.organization,
      deadline: t.closingDate!,
      url: getTenderApplyUrl(t),
    })),
  ].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  if (loading) {
    return <LoadingSpinner message="Aggregating personalized business opportunities & deadlines..." />;
  }

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#173B72] text-white p-6 sm:p-8 rounded-3xl border border-[#C89B3C]/40 shadow-gov space-y-4">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C89B3C] border border-[#C89B3C]/50 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> My Opportunity Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Centralised Government Opportunity Hub
            </h1>
            <p className="text-xs text-[#F3E8D0] max-w-2xl mt-1 leading-relaxed">
              Track recommended grants, manage bookmarked opportunities, monitor application stages, and never miss an upcoming government deadline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/schemes"
              className="bg-[#C89B3C] hover:bg-[#b58b32] text-[#172033] px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Browse All Schemes
            </Link>
          </div>
        </div>
      </div>

      {alertMsg && (
        <Alert type={alertMsg.type} message={alertMsg.text} onClose={() => setAlertMsg(null)} />
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav aria-label="Tabs" className="-mb-px flex flex-wrap gap-2 sm:gap-6 text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('RECOMMENDED')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'RECOMMENDED'
                ? 'border-[#173B72] text-[#173B72]'
                : 'border-transparent text-[#5E6B7D] hover:text-[#172033]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C89B3C]" />
            Recommended Opportunities ({recommendedSchemes.length + recommendedTenders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SAVED')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'SAVED'
                ? 'border-[#173B72] text-[#173B72]'
                : 'border-transparent text-[#5E6B7D] hover:text-[#172033]'
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#173B72]" />
            Saved Items ({savedSchemes.length + savedTenders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TRACKED')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'TRACKED'
                ? 'border-[#173B72] text-[#173B72]'
                : 'border-transparent text-[#5E6B7D] hover:text-[#172033]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#1B8354]" />
            Tracked Applications ({applications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DEADLINES')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'DEADLINES'
                ? 'border-[#173B72] text-[#173B72]'
                : 'border-transparent text-[#5E6B7D] hover:text-[#172033]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#C53030]" />
            Upcoming Deadlines ({upcomingDeadlineItems.length})
          </button>
        </nav>
      </div>

      {/* TAB 1: RECOMMENDED OPPORTUNITIES */}
      {activeTab === 'RECOMMENDED' && (
        <div className="space-y-8">
          {/* Recommended Schemes */}
          <div>
            <h2 className="text-base font-bold text-[#172033] mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1B8354]" />
              Recommended Schemes ({recommendedSchemes.length})
            </h2>
            {recommendedSchemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedSchemes.map((rec, idx) => (
                  <RecommendationCard key={`rec-sch-${idx}`} recommendation={rec} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-[#5E6B7D]">
                No recommended schemes matching &ge;70% threshold. Complete your business profile for better recommendations.
              </div>
            )}
          </div>

          {/* Recommended Tenders */}
          {recommendedTenders.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-[#172033] mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#173B72]" />
                Recommended Tenders ({recommendedTenders.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedTenders.map((rec, idx) => (
                  <RecommendationCard key={`rec-ten-${idx}`} recommendation={rec} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED OPPORTUNITIES */}
      {activeTab === 'SAVED' && (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#C89B3C]" />
            Your Bookmarked Opportunities
          </h2>
          {savedSchemes.length > 0 || savedTenders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSchemes.map((scheme) => (
                <SchemeCard key={`saved-sch-${scheme.id}`} scheme={scheme} isSavedInitial={true} />
              ))}
              {savedTenders.map((tender) => (
                <TenderCard key={`saved-ten-${tender.id}`} tender={tender} isSavedInitial={true} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-[#5E6B7D]">
              You haven't bookmarked any schemes or tenders yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TRACKED APPLICATIONS */}
      {activeTab === 'TRACKED' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#173B72]" />
              Application Tracker Dashboard
            </h2>

            {/* Status Filter */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-[#5E6B7D]">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#172033] focus:ring-1 focus:ring-[#173B72]"
              >
                <option value="ALL">All Statuses ({applications.length})</option>
                <option value="INTERESTED">INTERESTED</option>
                <option value="PREPARING">PREPARING</option>
                <option value="APPLIED">APPLIED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F5F7FA] border-b border-slate-200 text-[#173B72] font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Opportunity Title</th>
                      <th className="py-3.5 px-4">Current Status</th>
                      <th className="py-3.5 px-4">Application Date</th>
                      <th className="py-3.5 px-4">Notes</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#172033] max-w-xs truncate">
                          {app.title}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateAppStatus(app.id, e.target.value as ApplicationStatus)}
                            className="bg-[#E5EEF9] text-[#173B72] border border-[#C7DBF2] font-bold text-[11px] px-2.5 py-1 rounded-md cursor-pointer"
                          >
                            <option value="INTERESTED">INTERESTED</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="APPLIED">APPLIED</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-[#5E6B7D]">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-[#5E6B7D] max-w-xs truncate">
                          {app.notes || 'No notes added'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteApplication(app.id)}
                            className="p-1.5 text-slate-400 hover:text-[#C53030] rounded-lg transition-colors"
                            title="Delete from Tracker"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-[#5E6B7D]">
              No applications tracked matching status filter "{statusFilter}".
            </div>
          )}
        </div>
      )}

      {/* TAB 4: UPCOMING DEADLINES */}
      {activeTab === 'DEADLINES' && (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C53030]" />
            Upcoming Scheme & Tender Deadlines
          </h2>

          {upcomingDeadlineItems.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlineItems.map((item, idx) => {
                const diffDays = Math.ceil(
                  (new Date(item.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                );
                return (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-4 text-xs hover:border-[#173B72] transition-colors"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-[#E5EEF9] text-[#173B72] px-2 py-0.5 rounded">
                          {item.type}
                        </span>
                        <span className="font-bold text-[#172033] text-sm">{item.title}</span>
                      </div>
                      <div className="text-[#5E6B7D]">{item.department}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono font-bold text-[#C53030]">
                          {new Date(item.deadline).toLocaleDateString()}
                        </div>
                        <div className="text-[11px] font-semibold text-amber-700">
                          {diffDays > 0 ? `${diffDays} days remaining` : 'Closing today'}
                        </div>
                      </div>

                      {item.url && (
                        <button
                          type="button"
                          onClick={() => openExternalUrl(item.url)}
                          className="btn-primary py-2 px-3 text-xs font-bold flex items-center gap-1"
                        >
                          Apply <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-[#5E6B7D]">
              No upcoming deadlines for saved opportunities.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
