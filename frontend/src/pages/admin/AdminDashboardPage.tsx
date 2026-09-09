import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { DashboardStats } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Users,
  Building2,
  FileCheck,
  Layers,
  PlusCircle,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Server,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error loading admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching live administrative statistics..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">BizSahayak Platform Control</span>
          <h1 className="text-2xl sm:text-3xl font-black">Admin Management Panel</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/admin/government-sources" className="btn-primary text-xs py-2 px-3.5 bg-blue-600 hover:bg-blue-700">
            <Server className="w-4 h-4" /> Data Sources & Sync
          </Link>
          <Link to="/admin/schemes/pending-review" className="btn-primary text-xs py-2 px-3.5 bg-amber-600 hover:bg-amber-700">
            <Clock className="w-4 h-4" /> Pending Review Queue
          </Link>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.totalUsers}</div>
            <p className="text-[11px] text-slate-400">Registered platform accounts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Verif.</span>
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600">{stats.pendingBusinesses}</div>
            <Link to="/admin/businesses/pending" className="text-[11px] text-blue-600 font-bold hover:underline block">
              Review Applications →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Verified MSMEs</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{stats.verifiedBusinesses}</div>
            <p className="text-[11px] text-slate-400">Approved business profiles</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Schemes</span>
              <FileCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-600">{stats.activeSchemes}</div>
            <p className="text-[11px] text-slate-400">Published live schemes</p>
          </div>
        </div>
      )}

      {/* Admin Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/admin/government-sources"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Government Sources</h3>
            <p className="text-xs text-slate-500 mt-1">Configure permitted APIs, trigger manual syncs, & view sync logs.</p>
          </div>
        </Link>

        <Link
          to="/admin/schemes/pending-review"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Pending Review Queue</h3>
            <p className="text-xs text-slate-500 mt-1">Review imported schemes & tenders before live publication.</p>
          </div>
        </Link>

        <Link
          to="/admin/businesses/pending"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Business Verifications</h3>
            <p className="text-xs text-slate-500 mt-1">Review profiles, documents & approve/reject verifications.</p>
          </div>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Audit Logs</h3>
            <p className="text-xs text-slate-500 mt-1">Audit trail of all administrative actions & sync operations.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
