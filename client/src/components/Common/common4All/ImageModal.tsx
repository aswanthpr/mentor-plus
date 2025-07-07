import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
<div 
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 cursor-zoom-out transition-opacity"
  onClick={onClose}
>
      <div className="relative max-w-xl max-h-[90vh] w-full animate-scaleIn"
           onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 p-2 bg-white rounded-full shadow-lg 
                   hover:bg-gray-100 transition-colors z-10"
          aria-label="Close image"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <img
          src={imageUrl}
          alt="Full size"
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;