import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { citizenService } from '../../services/citizenService';
import { savedService } from '../../services/savedService';
import { notificationService } from '../../services/notificationService';
import { CitizenDashboardDto, Scheme, Tender } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { SchemeCard } from '../../components/SchemeCard';
import { TenderCard } from '../../components/TenderCard';
import {
  User,
  Sparkles,
  Bookmark,
  FileText,
  Bell,
  Clock,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  ExternalLink,
} from 'lucide-react';

export const CitizenDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<CitizenDashboardDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savedSchemeIds, setSavedSchemeIds] = useState<number[]>([]);
  const [savedTenderIds, setSavedTenderIds] = useState<number[]>([]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await citizenService.getCitizenDashboard();
      if (res.success && res.data) {
        setDashboard(res.data);
        if (res.data.savedSchemes) {
          setSavedSchemeIds(res.data.savedSchemes.map((s) => s.id));
        }
        if (res.data.savedTenders) {
          setSavedTenderIds(res.data.savedTenders.map((t) => t.id));
        }
      } else {
        setError(res.message || 'Failed to load citizen dashboard data');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error connecting to citizen portal service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleSaveScheme = async (schemeId: number) => {
    const isSaved = savedSchemeIds.includes(schemeId);
    try {
      if (isSaved) {
        await savedService.unsaveScheme(schemeId);
        setSavedSchemeIds((prev) => prev.filter((id) => id !== schemeId));
      } else {
        await savedService.saveScheme(schemeId);
        setSavedSchemeIds((prev) => [...prev, schemeId]);
      }
    } catch (err) {
      console.error('Error toggling scheme save state:', err);
    }
  };

  const handleToggleSaveTender = async (tenderId: number) => {
    const isSaved = savedTenderIds.includes(tenderId);
    try {
      if (isSaved) {
        await savedService.unsaveTender(tenderId);
        setSavedTenderIds((prev) => prev.filter((id) => id !== tenderId));
      } else {
        await savedService.saveTender(tenderId);
        setSavedTenderIds((prev) => [...prev, tenderId]);
      }
    } catch (err) {
      console.error('Error toggling tender save state:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your Citizen Dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Hero Welcome Banner */}
      <div
        className="relative rounded-3xl p-6 sm:p-8 text-white shadow-gov-lg overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#173B72]"
        style={{
          backgroundImage: "url('/assets/vidhan-bhawan.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#173B72]/95 via-[#173B72]/90 to-[#0F264A]/95 backdrop-blur-[1px]"></div>

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-[#C89B3C] text-[#172033] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              👤 Citizen Portal
            </span>
            <span className="text-xs text-[#F3E8D0] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1B8354]" /> Direct Government Assistance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {dashboard?.fullName || 'Citizen User'}
          </h1>
          <p className="text-xs sm:text-sm text-[#F3E8D0] leading-relaxed">
            Discover government schemes, subsidies, and educational assistance designed for citizens across India.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5 w-full md:w-auto">
          <Link
            to="/schemes"
            className="btn-primary text-xs py-2.5 px-4 bg-[#C89B3C] hover:bg-[#B7882D] text-[#172033] font-bold border border-[#C89B3C] shadow-sm flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" /> Explore Schemes
          </Link>
          <Link
            to="/tenders"
            className="btn-secondary text-xs py-2.5 px-4 bg-white/15 hover:bg-white/25 text-white font-bold border border-white/30 flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-[#C89B3C]" /> Explore Tenders
          </Link>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov space-y-2">
          <div className="flex items-center justify-between text-[#5E6B7D]">
            <span className="text-xs font-bold uppercase tracking-wider">Saved Items</span>
            <Bookmark className="w-5 h-5 text-[#C89B3C]" />
          </div>
          <div className="text-2xl font-black text-[#172033]">
            {(dashboard?.savedSchemesCount || 0) + (dashboard?.savedTendersCount || 0)}
          </div>
          <p className="text-[11px] text-[#5E6B7D]">Bookmarked opportunities</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov space-y-2">
          <div className="flex items-center justify-between text-[#5E6B7D]">
            <span className="text-xs font-bold uppercase tracking-wider">Tracked Apps</span>
            <Sparkles className="w-5 h-5 text-[#173B72]" />
          </div>
          <div className="text-2xl font-black text-[#173B72]">
            {dashboard?.totalTrackedApplicationsCount || 0}
          </div>
          <Link to="/citizen/opportunity-center" className="text-[11px] text-[#173B72] font-bold hover:underline block">
            Opportunity Center →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov space-y-2">
          <div className="flex items-center justify-between text-[#5E6B7D]">
            <span className="text-xs font-bold uppercase tracking-wider">Notifications</span>
            <Bell className="w-5 h-5 text-[#B7791F]" />
          </div>
          <div className="text-2xl font-black text-[#B7791F]">
            {dashboard?.unreadNotificationsCount || 0}
          </div>
          <p className="text-[11px] text-[#5E6B7D]">Unread updates & alerts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov space-y-2">
          <div className="flex items-center justify-between text-[#5E6B7D]">
            <span className="text-xs font-bold uppercase tracking-wider">New Schemes</span>
            <Zap className="w-5 h-5 text-[#1B8354]" />
          </div>
          <div className="text-2xl font-black text-[#1B8354]">
            {dashboard?.newSchemes?.length || 0}
          </div>
          <Link to="/citizen/new-schemes" className="text-[11px] text-[#1B8354] font-bold hover:underline block">
            View Latest Schemes →
          </Link>
        </div>
      </div>

      {/* Section 1: New Schemes & Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
              <span className="p-1.5 bg-[#E5EEF9] text-[#173B72] rounded-lg">✨</span>
              New Schemes & Opportunities
            </h2>
            <p className="text-xs text-[#5E6B7D] mt-0.5">Recently published government welfare, subsidy, and growth programs</p>
          </div>
          <Link
            to="/citizen/new-schemes"
            className="text-xs font-bold text-[#173B72] hover:text-[#2456A6] flex items-center gap-1 hover:underline"
          >
            View All New Schemes <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {dashboard?.newSchemes && dashboard.newSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboard.newSchemes.slice(0, 3).map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                isSavedInitial={savedSchemeIds.includes(scheme.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
            <p className="text-sm text-gray-500">No new schemes published recently.</p>
            <Link to="/schemes" className="btn-primary text-xs py-2 px-4 bg-[#173B72] text-white">
              Browse All Schemes
            </Link>
          </div>
        )}
      </div>

      {/* Section 2: Application Tracker Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-gov space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#172033] flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">📊</span>
              My Opportunity Center & Tracker
            </h3>
            <p className="text-xs text-[#5E6B7D] mt-0.5">Track your saved schemes, tenders, and application progress</p>
          </div>
          <Link
            to="/citizen/opportunity-center"
            className="btn-secondary text-xs py-2 px-3 bg-[#F5F7FA] text-[#173B72] border border-slate-300 font-bold self-start sm:self-auto"
          >
            Open Full Opportunity Center →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Interested</span>
            <span className="text-2xl font-black text-blue-900 mt-1 block">
              {dashboard?.trackedStatusCounts?.INTERESTED || 0}
            </span>
          </div>
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Preparing</span>
            <span className="text-2xl font-black text-amber-900 mt-1 block">
              {dashboard?.trackedStatusCounts?.PREPARING || 0}
            </span>
          </div>
          <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-100">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">Applied</span>
            <span className="text-2xl font-black text-purple-900 mt-1 block">
              {dashboard?.trackedStatusCounts?.APPLIED || 0}
            </span>
          </div>
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Completed</span>
            <span className="text-2xl font-black text-emerald-900 mt-1 block">
              {dashboard?.trackedStatusCounts?.COMPLETED || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Deadlines & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-gov space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#B7791F]" />
              Upcoming Deadlines
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Closing Soon
            </span>
          </div>

          {dashboard?.upcomingDeadlines && dashboard.upcomingDeadlines.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {dashboard.upcomingDeadlines.map((scheme) => (
                <div key={scheme.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/schemes/${scheme.slug}`}
                      className="text-xs font-bold text-[#172033] hover:text-[#173B72] truncate block"
                    >
                      {scheme.title}
                    </Link>
                    <span className="text-[11px] text-[#5E6B7D] block">{scheme.department || scheme.state}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#C53030] block">
                      {scheme.deadline ? new Date(scheme.deadline).toLocaleDateString() : 'N/A'}
                    </span>
                    <Link
                      to={`/schemes/${scheme.slug}/assistant`}
                      className="text-[10px] font-bold text-[#173B72] hover:underline"
                    >
                      Application Assistant →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-gray-500">
              No upcoming scheme deadlines closing soon.
            </div>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-gov space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#173B72]" />
              Recent Notifications
            </h3>
            {dashboard?.unreadNotificationsCount ? (
              <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                {dashboard.unreadNotificationsCount} Unread
              </span>
            ) : null}
          </div>

          {dashboard?.recentNotifications && dashboard.recentNotifications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {dashboard.recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.route) navigate(notif.route);
                  }}
                  className="py-3 flex items-start gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-[#173B72] mt-1.5 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#172033] truncate">{notif.title}</h4>
                    <p className="text-[11px] text-[#5E6B7D] line-clamp-2 mt-0.5">{notif.message}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-gray-500">
              No new notifications at this time.
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-[#F5F7FA] rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#172033] uppercase tracking-wider">Citizen Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Link
            to="/schemes"
            className="p-3 bg-white rounded-xl border border-slate-200 text-center hover:border-[#173B72] transition-all space-y-1 block shadow-xs"
          >
            <Search className="w-5 h-5 text-[#173B72] mx-auto" />
            <span className="text-xs font-bold text-[#172033] block">Find Schemes</span>
          </Link>
          <Link
            to="/tenders"
            className="p-3 bg-white rounded-xl border border-slate-200 text-center hover:border-[#173B72] transition-all space-y-1 block shadow-xs"
          >
            <FileText className="w-5 h-5 text-[#C89B3C] mx-auto" />
            <span className="text-xs font-bold text-[#172033] block">Browse Tenders</span>
          </Link>
          <Link
            to="/user/saved"
            className="p-3 bg-white rounded-xl border border-slate-200 text-center hover:border-[#173B72] transition-all space-y-1 block shadow-xs"
          >
            <Bookmark className="w-5 h-5 text-[#B7791F] mx-auto" />
            <span className="text-xs font-bold text-[#172033] block">Saved Items</span>
          </Link>
          <Link
            to="/citizen/opportunity-center"
            className="p-3 bg-white rounded-xl border border-slate-200 text-center hover:border-[#173B72] transition-all space-y-1 block shadow-xs"
          >
            <Sparkles className="w-5 h-5 text-indigo-600 mx-auto" />
            <span className="text-xs font-bold text-[#172033] block">Tracker</span>
          </Link>
          <Link
            to="/citizen/new-schemes"
            className="p-3 bg-white rounded-xl border border-slate-200 text-center hover:border-[#173B72] transition-all space-y-1 block shadow-xs"
          >
            <Zap className="w-5 h-5 text-[#1B8354] mx-auto" />
            <span className="text-xs font-bold text-[#172033] block">New Schemes</span>
          </Link>
          <Link
            to="/citizen/profile"
            className="p-3 bg-white rounded-xl border border-slate-200 text-center hover:border-[#173B72] transition-all space-y-1 block shadow-xs"
          >
            <User className="w-5 h-5 text-purple-600 mx-auto" />
            <span className="text-xs font-bold text-[#172033] block">My Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboardPage;
