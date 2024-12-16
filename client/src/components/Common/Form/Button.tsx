import React,{ButtonHTMLAttributes} from 'react';
import { clsx } from 'clsx';

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant? :'primary' | 'secondary' | 'dark' | 'orange';
    children?:JSX.Element|string;
    className?:string;
    disabled?:boolean;
    onChange?:()=>void



}


export const Button:React.FC<IButton> = ({children,className,variant='primary',disabled,...props}) => {
  return (
    <div>
<button className={clsx(
    'px-4 py-2 rounded-md font-medium transition-colors',
    variant==="primary"&& "bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-300",
    variant==="secondary"&& " text-orange hover:bg-orange-400 disabled:bg-orange-300",
    variant==="dark"&& "bg-black text-white hover:bg-grey-800 disabled:bg-grey-400",
    variant==="orange"&& "bg-[#ff8800] text-white  font-bold hover:bg-[#e67a00] disabled:bg-[#ffb366]",className

)
} 
disabled={disabled} {...props}
>
{children}
</button>
    </div>

  )
}

export default Button