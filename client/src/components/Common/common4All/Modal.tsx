// import { X } from 'lucide-react';
import React, { ReactNode } from 'react';

interface IModal {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<IModal> = ({ isOpen, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div  onClick={onClose} className='min-w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div  onClick={(e) => {e.stopPropagation()}}
        className='bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl p-6 relative'>
        {/* <button
        
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 ' >
          <X />
        </button> */}
        <div  className='mt-3 gap-4 text-justify leading-relaxed'>

        {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
