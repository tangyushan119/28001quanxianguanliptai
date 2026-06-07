import { ReactNode, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type ModalType = 'default' | 'success' | 'error' | 'warning' | 'info';
export type ModalSize = 'sm' | 'md' | 'lg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  type?: ModalType;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  type = 'default',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    default: {
      header: 'bg-white',
      icon: null,
      iconBg: '',
      iconColor: '',
      border: 'border-gray-100',
    },
    success: {
      header: 'bg-success-50',
      icon: CheckCircle,
      iconBg: 'bg-success-100',
      iconColor: 'text-success-500',
      border: 'border-success-100',
    },
    error: {
      header: 'bg-error-50',
      icon: AlertCircle,
      iconBg: 'bg-error-100',
      iconColor: 'text-error-500',
      border: 'border-error-100',
    },
    warning: {
      header: 'bg-warning-50',
      icon: AlertTriangle,
      iconBg: 'bg-warning-100',
      iconColor: 'text-warning-500',
      border: 'border-warning-100',
    },
    info: {
      header: 'bg-info-50',
      icon: Info,
      iconBg: 'bg-info-100',
      iconColor: 'text-info-500',
      border: 'border-info-100',
    },
  };

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const currentStyles = typeStyles[type];
  const Icon = currentStyles.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      <div
        className={`relative bg-white rounded-xl shadow-xl w-full ${sizeStyles[size]} overflow-hidden border ${currentStyles.border}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={`px-6 py-4 border-b ${currentStyles.border} ${currentStyles.header}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className={`w-10 h-10 ${currentStyles.iconBg} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${currentStyles.iconColor}`} />
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="关闭"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}