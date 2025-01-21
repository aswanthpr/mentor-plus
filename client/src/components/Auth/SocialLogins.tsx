import React from 'react';
import {LucideIcon} from 'lucide-react';

interface ISocialLogins{
    icon:LucideIcon,
    provider:string;
    onClick:()=>void;
}

const SocialLogins:React.FC<ISocialLogins>=({icon:Icon,provider,onClick})=>{
    return (
        <button onClick={onClick}
        className='w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-grey-200 rounded-lg hover:bg-grey-50 transition-colors'>
<Icon className='w-5 h-5'/>
<span className='text-sm font-medium'>Continue with{provider}</span>
        </button>
    )
}

export default SocialLogins