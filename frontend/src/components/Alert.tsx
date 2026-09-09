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
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          icon: <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-900',
          icon: <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          icon: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-900',
          icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
        };
    }
  };

  const style = getStyles();

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-medium ${style.bg} transition-all`}>
      {style.icon}
      <div className="flex-1 pt-0.5">{message}</div>
      {onClose && (
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold ml-2">
          ✕
        </button>
      )}
    </div>
  );
};
