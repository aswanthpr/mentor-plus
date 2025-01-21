import React,{ButtonHTMLAttributes, ReactNode} from 'react';
import { clsx } from 'clsx';

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant? :'primary' | 'secondary' | 'dark' | 'orange';
    children?:JSX.Element|ReactNode;
    className?:string;
    disabled?:boolean;
    onChange?:()=>void



}


export const Button: React.FC<IButton> = ({ children, className, variant = 'primary', disabled, ...props }) => {
  return (
    <div>
      <button
        className={clsx(
          `px-4 py-2 rounded-md font-medium transition-colors`, // Default styles
          className, // <-- This line was added to include the passed className prop (e.g., mt-4 ml-4)
          variant === "primary" && "bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-300",
          variant === "secondary" && "text-orange hover:bg-orange-400 disabled:bg-orange-300",
          variant === "dark" && "bg-black text-white hover:bg-grey-800 disabled:bg-grey-400",
          variant === "orange" && "bg-[#ff8800] text-white font-bold hover:bg-[#e67a00] disabled:bg-[#ffb366]"
        )}
        disabled={disabled} 
        {...props}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;


