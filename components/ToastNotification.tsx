import React, { useEffect } from 'react';

interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const baseClasses = 'fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg text-white animate-slide-in-right border';
  const typeClasses = type === 'success' 
    ? 'bg-green-600/90 border-green-500' 
    : 'bg-red-600/90 border-red-500';

  return (
    <>
      <div className={`${baseClasses} ${typeClasses}`}>
        {message}
      </div>
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default ToastNotification;
