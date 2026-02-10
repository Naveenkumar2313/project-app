
import React from 'react';
import { useNotification, ToastType } from '../contexts/NotificationContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />
};

const bgColors = {
  success: 'bg-white border-l-4 border-green-500',
  error: 'bg-white border-l-4 border-red-500',
  info: 'bg-white border-l-4 border-blue-500',
  warning: 'bg-white border-l-4 border-yellow-500'
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotification();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${bgColors[toast.type]} shadow-lg rounded-r-lg p-4 flex items-start transform transition-all duration-300 animate-slideIn pointer-events-auto`}
        >
          <div className="flex-shrink-0 mr-3 mt-0.5">
            {icons[toast.type]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">{toast.message}</p>
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
