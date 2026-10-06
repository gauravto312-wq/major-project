import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { DashboardStats } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { AdminHeaderNav } from '../../components/AdminHeaderNav';
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
  ArrowRight,
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
    <>
      <AdminHeaderNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner with Vidhan Bhawan Visual Identity */}
        <div
          className="relative rounded-3xl p-6 sm:p-8 text-white shadow-gov-lg overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#173B72]"
          style={{
            backgroundImage: "url('/assets/vidhan-bhawan.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#173B72]/95 via-[#173B72]/90 to-[#0F264A]/95 backdrop-blur-[1px]"></div>

          <div className="relative z-10 space-y-1">
            <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1B8354]" /> BizSahayak Governance Control
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Administrative Management Panel</h1>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2">
            <Link to="/admin/sources" className="btn-primary text-xs py-2 px-3.5 bg-[#173B72] hover:bg-[#2456A6] border border-[#C89B3C]/40">
              <Server className="w-4 h-4 text-[#C89B3C]" /> Data Sources & Sync
            </Link>
            <Link to="/admin/imported-data" className="btn-accent text-xs py-2 px-3.5">
              <Clock className="w-4 h-4" /> Pending Review Queue
            </Link>
          </div>
        </div>

        {/* Analytics Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov space-y-2">
              <div className="flex items-center justify-between text-[#5E6B7D]">
                <span className="text-xs font-bold uppercase tracking-wider">Total Accounts</span>
                <Users className="w-5 h-5 text-[#173B72]" />
              </div>
              <div className="text-2xl font-black text-[#172033]">{stats.totalUsers}</div>
              <p className="text-[11px] text-[#5E6B7D]">Registered platform accounts</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov space-y-2">
              <div className="flex items-center justify-between text-[#5E6B7D]">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Verif.</span>
                <AlertCircle className="w-5 h-5 text-[#B7791F]" />
              </div>
              <div className="text-2xl font-black text-[#B7791F]">{stats.pendingBusinesses}</div>
              <Link to="/admin/businesses" className="text-[11px] text-[#173B72] font-bold hover:underline block">
                Review Applications →
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov space-y-2">
              <div className="flex items-center justify-between text-[#5E6B7D]">
                <span className="text-xs font-bold uppercase tracking-wider">Verified MSMEs</span>
                <CheckCircle2 className="w-5 h-5 text-[#1B8354]" />
              </div>
              <div className="text-2xl font-black text-[#1B8354]">{stats.verifiedBusinesses}</div>
              <p className="text-[11px] text-[#5E6B7D]">Approved business profiles</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov space-y-2">
              <div className="flex items-center justify-between text-[#5E6B7D]">
                <span className="text-xs font-bold uppercase tracking-wider">Active Schemes</span>
                <FileCheck className="w-5 h-5 text-[#173B72]" />
              </div>
              <div className="text-2xl font-black text-[#173B72]">{stats.activeSchemes}</div>
              <p className="text-[11px] text-[#5E6B7D]">Published live schemes</p>
            </div>
          </div>
        )}

        {/* Admin Quick Action Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <Link
            to="/admin/citizens"
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-gov hover:border-[#173B72] hover:shadow-gov-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E5EEF9] text-[#173B72] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#173B72]">Citizen Accounts</h3>
              <p className="text-xs text-[#5E6B7D] mt-1">Audit registered citizen profiles, saved schemes & application activity.</p>
            </div>
          </Link>

          <Link
            to="/admin/sources"
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-gov hover:border-[#173B72] hover:shadow-gov-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E5EEF9] text-[#173B72] flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#173B72]">Government Sources</h3>
              <p className="text-xs text-[#5E6B7D] mt-1">Configure permitted APIs, trigger manual syncs, & view sync logs.</p>
            </div>
          </Link>

          <Link
            to="/admin/imported-data"
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-gov hover:border-[#C89B3C] hover:shadow-gov-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FEF7E6] text-[#B7791F] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-[#C89B3C]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#B7791F]">Pending Review Queue</h3>
              <p className="text-xs text-[#5E6B7D] mt-1">Review imported schemes & tenders before live publication.</p>
            </div>
          </Link>

          <Link
            to="/admin/businesses"
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-gov hover:border-[#1B8354] hover:shadow-gov-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EBF7F0] text-[#1B8354] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#1B8354]">Business Verifications</h3>
              <p className="text-xs text-[#5E6B7D] mt-1">Review profiles, documents & approve/reject verifications.</p>
            </div>
          </Link>

          <Link
            to="/admin/audit-logs"
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-gov hover:border-[#2456A6] hover:shadow-gov-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E5EEF9] text-[#2456A6] flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#2456A6]">Audit Trail Logs</h3>
              <p className="text-xs text-[#5E6B7D] mt-1">Audit trail of all administrative actions & sync operations.</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
