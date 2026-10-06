import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No official records found',
  description = 'There are no published schemes or tenders matching your criteria at this time.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/95 rounded-2xl border border-slate-200 shadow-gov max-w-md mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-[#F5F7FA] border border-[#D8C39A]/40 flex items-center justify-center text-[#C89B3C] mb-4 shadow-sm">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-[#172033] mb-1.5">{title}</h3>
      <p className="text-xs text-[#5E6B7D] max-w-xs mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
};
