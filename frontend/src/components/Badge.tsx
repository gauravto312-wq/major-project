import React from 'react';

interface BadgeProps {
  status: string;
  type?: 'default' | 'verification' | 'scheme' | 'tender' | 'application';
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getBadgeStyle = (statusStr: string) => {
    switch (statusStr?.toUpperCase()) {
      case 'VERIFIED':
      case 'PUBLISHED':
      case 'ACTIVE':
      case 'APPROVED':
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PENDING':
      case 'PENDING_REVIEW':
      case 'IMPORTED':
      case 'DRAFT':
      case 'PREPARING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'REJECTED':
      case 'CANCELLED':
      case 'EXPIRED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'CORRECTION_REQUIRED':
      case 'INACTIVE':
      case 'CLOSED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'INTERESTED':
      case 'APPLIED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ARCHIVED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(
        status
      )}`}
    >
      {status?.replace('_', ' ')}
    </span>
  );
};
