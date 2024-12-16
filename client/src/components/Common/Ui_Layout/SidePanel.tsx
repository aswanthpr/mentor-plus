import React from 'react';
import { NavLink } from 'react-router-dom';


export interface INavItem{
name:string;
path:string;
icon:React.FC<{className?:string}>;
}
interface ISideBar{
SideBarItems:INavItem[]
}

const SidePanel:React.FC<ISideBar> = ({SideBarItems}) => {
  return (
<aside className='fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200'>
    <nav className='p-4 space-y-1'>
        {
            SideBarItems.map((item)=>(
                <NavLink
                key={item.name}
                to={item.path}
                className={({isActive})=>`flex items-center px-4 py-3 rounded-lg transition-colors${isActive?'bg-[#fff3e6] text-[#ff8800]':'text-gray-600 hover:bg-gray-50'}`}
                >
                <item.icon className='h-5 w-5 mr-3 '/>
                <span className="font-medium">{item.name}</span>
                </NavLink>
            ))
        }

    </nav>

</aside>
  )
}

export default SidePanel;