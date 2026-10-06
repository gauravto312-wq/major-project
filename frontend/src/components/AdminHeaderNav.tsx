import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Server,
  FileCheck,
  Search,
  Clock,
  Building2,
  Users,
  Activity,
  Plus,
} from 'lucide-react';

export const AdminHeaderNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Government API Sources',
      path: '/admin/sources',
      icon: Server,
      badge: 'API Add & Sync',
    },
    {
      label: 'Schemes',
      path: '/admin/schemes',
      icon: FileCheck,
    },
    {
      label: 'Tenders',
      path: '/admin/tenders',
      icon: Search,
    },
    {
      label: 'Pending Review',
      path: '/admin/imported-data',
      icon: Clock,
    },
    {
      label: 'Business Verifications',
      path: '/admin/businesses',
      icon: Building2,
    },
    {
      label: 'Citizens',
      path: '/admin/citizens',
      icon: Users,
    },
    {
      label: 'Audit Trail',
      path: '/admin/audit-logs',
      icon: Activity,
    },
  ];

  return (
    <div className="bg-[#173B72] text-white border-b border-[#C89B3C]/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#C89B3C] text-[#172033] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs text-[#F3E8D0] font-semibold hidden md:inline">
              Manage Schemes, Tenders, Verification & Government APIs
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/sources"
              className="bg-[#C89B3C] hover:bg-[#B7882D] text-[#172033] font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Government API
            </Link>
          </div>
        </div>

        {/* Sub Navigation Links */}
        <div className="flex items-center gap-1 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-[#173B72] shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#173B72]' : 'text-[#C89B3C]'}`} />
                {item.label}
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                      isActive ? 'bg-[#173B72] text-[#C89B3C]' : 'bg-[#C89B3C]/30 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
