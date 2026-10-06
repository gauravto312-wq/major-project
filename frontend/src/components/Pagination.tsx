import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <nav aria-label="Pagination Navigation" className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-200">
      <div className="text-xs text-[#5E6B7D] font-medium">
        Showing <span className="font-bold text-[#173B72]">{startItem}</span> to{' '}
        <span className="font-bold text-[#173B72]">{endItem}</span> of{' '}
        <span className="font-bold text-[#173B72]">{totalElements}</span> opportunities
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          aria-label="Previous Page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-xs font-bold text-[#172033] px-2 bg-white border border-slate-200 py-1.5 rounded-md shadow-xs">
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          type="button"
          aria-label="Next Page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
