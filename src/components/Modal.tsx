import React from 'react';
import { X } from 'lucide-react';
import PromiseCard from './PromiseCard';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative w-full max-w-3xl mx-4 bg-beige/90 rounded-lg shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 p-2 bg-gray-800/90 rounded-full text-gray-300 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 