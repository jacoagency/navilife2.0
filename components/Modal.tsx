import { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  actions: {
    confirm: {
      text: string;
      onClick: () => void;
      variant?: 'danger' | 'primary' | 'secondary';
    };
    cancel?: {
      text?: string;
      onClick?: () => void;
    };
  };
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  icon, 
  children, 
  actions 
}: ModalProps) {
  if (!isOpen) return null;

  const getButtonClasses = (variant: string = 'primary') => {
    const baseClasses = "px-4 py-2 rounded-lg transition-colors";
    switch (variant) {
      case 'danger':
        return `${baseClasses} bg-red-500 text-white hover:bg-red-600`;
      case 'primary':
        return `${baseClasses} bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90`;
      case 'secondary':
        return `${baseClasses} bg-navy-700 text-gray-300 hover:bg-navy-600`;
      default:
        return `${baseClasses} bg-navy-700 text-gray-300 hover:bg-navy-600`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-navy-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border border-navy-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="text-gray-300 mb-6">
          {children}
        </div>

        <div className="flex justify-end gap-3">
          {actions.cancel && (
            <button
              onClick={actions.cancel.onClick || onClose}
              className={getButtonClasses('secondary')}
            >
              {actions.cancel.text || 'Cancel'}
            </button>
          )}
          <button
            onClick={actions.confirm.onClick}
            className={getButtonClasses(actions.confirm.variant)}
          >
            {actions.confirm.text}
          </button>
        </div>
      </div>
    </div>
  );
} 