import { X } from 'lucide-react';
import React,{ ReactNode} from 'react';

interface IModal{
    isOpen:boolean;
    onClose:()=>void;
    children:ReactNode;
}
 
const Modal:React.FC<IModal> = ({isOpen,children,onClose}) => {
    if(!isOpen)return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4  z-50'>
        <div
         
        className='bg-white rounded-lg w-full max-w-md p-6 relative'>
            <button onClick={onClose}
            className='absolute top-4 right-4 text-grey-500 hover:text-grey-700'>
            <X/>
            </button>
            {children}
        </div>

    </div> 
  )
}

export default Modal;