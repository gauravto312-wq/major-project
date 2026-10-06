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
        return 'bg-[#EBF7F0] text-[#1B8354] border-[#A3D9BD]';
      case 'PENDING':
      case 'PENDING_REVIEW':
      case 'IMPORTED':
      case 'DRAFT':
      case 'PREPARING':
        return 'bg-[#FEF7E6] text-[#B7791F] border-[#F8D88E]';
      case 'REJECTED':
      case 'CANCELLED':
      case 'EXPIRED':
        return 'bg-[#FDF2F2] text-[#C53030] border-[#F7A3A3]';
      case 'CORRECTION_REQUIRED':
      case 'INACTIVE':
      case 'CLOSED':
        return 'bg-slate-100 text-[#5E6B7D] border-slate-300';
      case 'INTERESTED':
      case 'APPLIED':
        return 'bg-[#E5EEF9] text-[#173B72] border-[#C7DBF2]';
      case 'ARCHIVED':
      default:
        return 'bg-slate-100 text-[#5E6B7D] border-slate-200';
    }
  };

  const formattedStatus = status ? status.replace(/_/g, ' ') : '';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border tracking-wide uppercase ${getBadgeStyle(
        status
      )}`}
    >
      {formattedStatus}
    </span>
  );
};
