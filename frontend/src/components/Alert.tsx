import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose }) => {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-[#EBF7F0] border-[#A3D9BD] text-[#1B8354]',
          icon: <CheckCircle className="w-5 h-5 text-[#1B8354] flex-shrink-0" />,
        };
      case 'error':
        return {
          bg: 'bg-[#FDF2F2] border-[#F7A3A3] text-[#C53030]',
          icon: <XCircle className="w-5 h-5 text-[#C53030] flex-shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-[#FEF7E6] border-[#F8D88E] text-[#B7791F]',
          icon: <AlertCircle className="w-5 h-5 text-[#B7791F] flex-shrink-0" />,
        };
      default:
        return {
          bg: 'bg-[#E5EEF9] border-[#C7DBF2] text-[#173B72]',
          icon: <Info className="w-5 h-5 text-[#173B72] flex-shrink-0" />,
        };
    }
  };

  const style = getStyles();

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-semibold ${style.bg} transition-all shadow-sm`}
    >
      {style.icon}
      <div className="flex-1 pt-0.5 leading-relaxed">{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="text-slate-400 hover:text-slate-600 font-bold ml-2 p-1 rounded hover:bg-black/5 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
};
