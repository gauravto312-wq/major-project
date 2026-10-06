import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { NotificationItem } from '../types';
import {
  Building2,
  FileText,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  ShieldAlert,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Menu,
  X,
  Server,
  Clock,
  Activity,
  Plus,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated, location.pathname]);

  // Click outside & Escape key listeners for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotificationsOpen(false);
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const countRes = await notificationService.getUnreadCount();
      if (countRes.success) {
        setUnreadCount(countRes.data.unreadCount);
      }
      const listRes = await notificationService.getNotifications();
      if (listRes.success) {
        setNotifications(listRes.data || []);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
    } catch (err) {
      // silent
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#173B72]/20 backdrop-blur-md border-b border-[#C89B3C]/35 text-white shadow-xs">
      {/* Top National / Institutional Accent Line */}
      <div className="h-1 bg-gradient-to-r from-[#173B72] via-[#C89B3C] to-[#1B8354] w-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-[#C89B3C] shadow-sm border border-[#C89B3C]/50 group-hover:bg-white/25 transition-colors">
                <Building2 className="w-5 h-5 text-[#C89B3C]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight flex items-center gap-1 drop-shadow-xs">
                  Biz<span className="text-[#C89B3C]">Sahayak</span>
                  <span className="w-2 h-2 rounded-full bg-[#1B8354] inline-block"></span>
                </span>
                <span className="text-[10px] font-bold text-[#F3E8D0] uppercase tracking-wider -mt-1 drop-shadow-xs">
                  Govt Opportunity Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav aria-label="Main Navigation" className="hidden md:flex ml-8 space-x-1">
              <Link
                to="/schemes"
                className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                  location.pathname.startsWith('/schemes')
                    ? 'bg-white/25 backdrop-blur-sm text-white border border-[#C89B3C]/60 shadow-xs'
                    : 'text-white/95 hover:text-white hover:bg-white/15'
                }`}
              >
                <FileText className="w-4 h-4 text-[#C89B3C]" />
                Schemes & Grants
              </Link>
              <Link
                to="/tenders"
                className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                  location.pathname.startsWith('/tenders')
                    ? 'bg-white/25 backdrop-blur-sm text-white border border-[#C89B3C]/60 shadow-xs'
                    : 'text-white/95 hover:text-white hover:bg-white/15'
                }`}
              >
                <Search className="w-4 h-4 text-[#C89B3C]" />
                Tenders
              </Link>

              {(user?.role === 'ROLE_CITIZEN' || user?.role === 'ROLE_USER') && (
                <>
                  <Link
                    to="/citizen/dashboard"
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/citizen/dashboard'
                        ? 'bg-white/25 backdrop-blur-sm text-white border border-[#C89B3C]/60 shadow-xs'
                        : 'text-white/95 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#C89B3C]" />
                    Dashboard
                  </Link>
                  <Link
                    to="/citizen/new-schemes"
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/citizen/new-schemes'
                        ? 'bg-white/25 backdrop-blur-sm text-white border border-[#C89B3C]/60 shadow-xs'
                        : 'text-white/95 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#C89B3C]" />
                    New Schemes
                  </Link>
                  <Link
                    to="/citizen/opportunity-center"
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/citizen/opportunity-center'
                        ? 'bg-white/25 backdrop-blur-sm text-white border border-[#C89B3C]/60 shadow-xs'
                        : 'text-white/95 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 text-[#C89B3C]" />
                    Opportunity Center
                  </Link>
                </>
              )}

              {user?.role === 'ROLE_BUSINESS' && (
                <>
                  <Link
                    to="/business/dashboard"
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/business/dashboard'
                        ? 'bg-white/25 backdrop-blur-sm text-white border border-[#C89B3C]/60 shadow-xs'
                        : 'text-white/95 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#C89B3C]" />
                    Business Dashboard
                  </Link>
                  <Link
                    to="/business/opportunity-center"
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/business/opportunity-center'
                        ? 'bg-white/25 backdrop-blur-sm text-white border border-[#C89B3C]/60 shadow-xs'
                        : 'text-white/95 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#C89B3C]" />
                    Opportunity Center
                  </Link>
                </>
              )}

              {user?.role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin"
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-white/25 backdrop-blur-sm text-white border border-[#C89B3C]/60 shadow-xs'
                      : 'text-white/95 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-[#C89B3C]" />
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Notification Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    aria-label="Notifications"
                    aria-expanded={notificationsOpen}
                    aria-haspopup="true"
                    className="p-2 text-white/90 hover:text-white rounded-lg hover:bg-white/15 transition-colors relative"
                  >
                    <Bell className="w-5 h-5 text-[#F3E8D0]" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C53030] text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white text-[#172033] rounded-xl shadow-gov-lg border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-[#F5F7FA]">
                        <span className="text-xs font-bold text-[#173B72] uppercase tracking-wider">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllRead}
                            className="text-xs text-[#2456A6] hover:underline font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={async () => {
                                if (!n.readStatus) {
                                  await notificationService.markAsRead(n.id);
                                  setNotifications((prev) =>
                                    prev.map((item) => (item.id === n.id ? { ...item, readStatus: true } : item))
                                  );
                                  setUnreadCount((prev) => Math.max(0, prev - 1));
                                }
                                setNotificationsOpen(false);
                                if (n.route) {
                                  navigate(n.route);
                                } else if (n.actionUrl) {
                                  navigate(n.actionUrl);
                                } else if (user?.role === 'ROLE_BUSINESS') {
                                  navigate('/business/opportunity-center');
                                }
                              }}
                              className={`p-3 text-xs cursor-pointer hover:bg-slate-100 transition-colors ${
                                !n.readStatus ? 'bg-[#E5EEF9]/40' : 'bg-white'
                              }`}
                            >
                              <div className="font-semibold text-[#172033] mb-0.5">{n.title}</div>
                              <div className="text-[#5E6B7D] line-clamp-2">{n.message}</div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-slate-400 text-xs">No notifications yet</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-expanded={userDropdownOpen}
                    aria-haspopup="true"
                    aria-label="User Account Menu"
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/15 text-white font-semibold text-xs transition-colors border border-white/25"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2456A6] text-white font-bold flex items-center justify-center text-xs border border-[#C89B3C]/60">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate text-white">{user?.fullName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#F3E8D0]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white text-[#172033] rounded-xl shadow-gov-lg border border-slate-200 py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 bg-[#F5F7FA]">
                        <div className="text-xs font-bold text-[#173B72] truncate">{user?.fullName}</div>
                        <div className="text-[11px] text-[#5E6B7D] truncate">{user?.email}</div>
                        <div className="mt-1">
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-[#E5EEF9] text-[#173B72] border border-[#C7DBF2] uppercase">
                            {user?.role?.replace('ROLE_', '')}
                          </span>
                        </div>
                      </div>

                      {user?.role === 'ROLE_BUSINESS' && (
                        <>
                          <Link
                            to="/business/opportunity-center"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <Sparkles className="w-4 h-4 text-[#C89B3C]" />
                            Opportunity Center
                          </Link>
                          <Link
                            to="/business/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <Building2 className="w-4 h-4 text-[#5E6B7D]" />
                            Business Profile
                          </Link>
                          <Link
                            to="/business/documents"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#1B8354]" />
                            Document Vault
                          </Link>
                          <Link
                            to="/business/saved"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <Bookmark className="w-4 h-4 text-[#C89B3C]" />
                            Saved Opportunities
                          </Link>
                          <Link
                            to="/business/applications"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <FileText className="w-4 h-4 text-[#5E6B7D]" />
                            My Applications
                          </Link>
                        </>
                      )}

                      {(user?.role === 'ROLE_CITIZEN' || user?.role === 'ROLE_USER') && (
                        <>
                          <Link
                            to="/citizen/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <Building2 className="w-4 h-4 text-[#173B72]" />
                            Citizen Dashboard
                          </Link>
                          <Link
                            to="/citizen/new-schemes"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <Sparkles className="w-4 h-4 text-[#C89B3C]" />
                            New Schemes
                          </Link>
                          <Link
                            to="/citizen/opportunity-center"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <Bookmark className="w-4 h-4 text-[#1B8354]" />
                            Opportunity Center
                          </Link>
                          <Link
                            to="/user/saved"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <Bookmark className="w-4 h-4 text-[#C89B3C]" />
                            Saved Opportunities
                          </Link>
                          <Link
                            to="/user/applications"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <FileText className="w-4 h-4 text-[#5E6B7D]" />
                            My Applications
                          </Link>
                          <Link
                            to="/citizen/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <Building2 className="w-4 h-4 text-[#5E6B7D]" />
                            My Profile
                          </Link>
                        </>
                      )}

                      {user?.role === 'ROLE_ADMIN' && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <ShieldAlert className="w-4 h-4 text-[#173B72]" />
                            Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/sources"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <div className="flex items-center gap-2">
                              <Server className="w-4 h-4 text-[#C89B3C]" />
                              Govt API Sources
                            </div>
                            <span className="text-[9px] font-bold bg-[#C89B3C] text-[#172033] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Plus className="w-2.5 h-2.5" /> ADD API
                            </span>
                          </Link>
                          <Link
                            to="/admin/schemes"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <FileText className="w-4 h-4 text-[#5E6B7D]" />
                            Manage Schemes
                          </Link>
                          <Link
                            to="/admin/tenders"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <Search className="w-4 h-4 text-[#5E6B7D]" />
                            Manage Tenders
                          </Link>
                          <Link
                            to="/admin/imported-data"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <Clock className="w-4 h-4 text-[#B7791F]" />
                            Pending Data Review
                          </Link>
                          <Link
                            to="/admin/businesses"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <Building2 className="w-4 h-4 text-[#1B8354]" />
                            Business Verifications
                          </Link>
                          <Link
                            to="/admin/audit-logs"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F5F7FA]"
                          >
                            <Activity className="w-4 h-4 text-[#2456A6]" />
                            Audit Trail Logs
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#C53030] hover:bg-[#FDF2F2] text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="text-xs font-bold text-white hover:text-[#172033] bg-white/10 hover:bg-white border border-white/40 hover:border-white px-3.5 py-2 rounded-lg transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register/business"
                  className="text-xs font-bold text-[#172033] bg-[#C89B3C] hover:bg-[#B7882D] px-4 py-2 rounded-lg border border-[#C89B3C] shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#172033]" />
                  Register Business
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/15"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#C89B3C]/30 bg-[#173B72]/95 backdrop-blur-lg text-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <Link
            to="/schemes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/15"
          >
            Schemes & Grants
          </Link>
          <Link
            to="/tenders"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/15"
          >
            Tenders
          </Link>

          {isAuthenticated ? (
            <>
              {(user?.role === 'ROLE_CITIZEN' || user?.role === 'ROLE_USER') && (
                <>
                  <Link
                    to="/citizen/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[#2456A6]"
                  >
                    Citizen Dashboard
                  </Link>
                  <Link
                    to="/citizen/new-schemes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/15"
                  >
                    New Schemes
                  </Link>
                  <Link
                    to="/citizen/opportunity-center"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/15"
                  >
                    Opportunity Center
                  </Link>
                </>
              )}

              {user?.role === 'ROLE_BUSINESS' && (
                <>
                  <Link
                    to="/business/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[#2456A6]"
                  >
                    Business Dashboard
                  </Link>
                  <Link
                    to="/business/recommendations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/15"
                  >
                    Recommendations
                  </Link>
                </>
              )}
              {user?.role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[#2456A6]"
                >
                  Admin Panel
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-300 hover:bg-white/15"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full text-xs font-bold text-white py-2.5 rounded-lg border border-white/40 hover:bg-white/15"
              >
                Sign In
              </Link>
              <Link
                to="/register/business"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full text-xs font-bold text-[#172033] bg-[#C89B3C] py-2.5 rounded-lg"
              >
                Register Business
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
