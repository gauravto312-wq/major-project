import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, ShieldCheck, Calendar, CheckCircle2 } from 'lucide-react';

export const CitizenProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-gov space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#173B72] text-[#C89B3C] font-black text-3xl flex items-center justify-center border-4 border-[#C89B3C]/40 shadow-sm shrink-0">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-2xl font-black text-[#172033]">{user?.fullName}</h1>
            <p className="text-sm text-[#5E6B7D]">{user?.email}</p>
            <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                👤 Citizen Account
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mr-1" /> Account Active
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <User className="w-5 h-5 text-[#173B72] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-gray-500 block uppercase">Full Legal Name</span>
              <span className="font-semibold text-gray-900">{user?.fullName}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <Mail className="w-5 h-5 text-[#173B72] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-gray-500 block uppercase">Registered Email</span>
              <span className="font-semibold text-gray-900 break-all">{user?.email}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <Phone className="w-5 h-5 text-[#173B72] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-gray-500 block uppercase">Mobile Contact</span>
              <span className="font-semibold text-gray-900">{user?.phone || 'Not provided'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <ShieldCheck className="w-5 h-5 text-[#1B8354] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-gray-500 block uppercase">Role & Permissions</span>
              <span className="font-semibold text-gray-900">{user?.role}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#E5EEF9]/60 p-4 rounded-xl border border-[#C7DBF2] text-xs text-[#173B72] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#173B72] shrink-0" />
          <span>
            As a Citizen User, you have full access to Scheme Search, Application Assistant, Saved Opportunities, and Tracker features without needing an MSME profile.
          </span>
        </div>
      </div>
    </div>
  );
};

export default CitizenProfilePage;
