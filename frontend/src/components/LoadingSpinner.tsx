import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading official records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3" role="status" aria-live="polite">
      <div className="w-10 h-10 border-4 border-[#E5EEF9] border-t-[#173B72] border-r-[#C89B3C] rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-[#5E6B7D] tracking-wide">{message}</p>
      <span className="sr-only">Loading</span>
    </div>
  );
};
