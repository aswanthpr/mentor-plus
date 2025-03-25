// import { X } from 'lucide-react';
import React from "react";

const Modal: React.FC<IModal> = ({ isOpen, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="min-w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl p-6 relative"
      >
        <div className="mt-3 gap-4 text-justify leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
