

import React, { useState } from 'react';
import logo from '/mentor+logo.png'
import { AlignJustify, Bell, LogOut, Search, User } from 'lucide-react';
import InputField from '../Form/InputField';
import NotificationPanel from './NotificationPanel';
import {INotification} from "./NotificationItem"

interface IHeader{
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
    value:string;
    placeholder:string;
    ToggleSideBar:()=>void;

}
const Header:React.FC<IHeader> = (props) => {
   
const [showProfileMenu,setShowProfileMenu] = useState<boolean>(false);
const [showNotification,setShowNotification]=useState<boolean>(false);
const [notifications,setNotifications] = useState<INotification[]>([
    {
        id: '1',
        title: 'New Message from John Doe',
        message: 'Hey, I would like to schedule a mentoring session with you next week.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        type: 'message'
      },
      {
        id: '2',
        title: 'Upcoming Session',
        message: 'Your mentoring session with Sarah starts in 1 hour.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        read: false,
        type: 'booking'
      },
])


const unreadCount = notifications.filter((n) =>!n.read!).length;

  const handleReadNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  return (
    <header className='bg-white border-b border-gray-200 top-0 left-0 right-0 z-40 '>
        <div className='h-16 px-4 flex items-center justify-between'>
        
            
            <div className='flex items-center gap-1'>
            <div onClick={props.ToggleSideBar}
            aria-label='Toggle Sidebar'
            >
            <AlignJustify className='mr-1 '/>
            </div>

            <img src={logo} alt=""  className='w-auto h-24'/>
            </div>
            <div className='flex-1 max-w-xl mx-4'>
                <div className='relative '>
                    <Search
                    className='absolute mt-1.5 left-3 top-1/2 transform -translate-y-1/2  text-grey-400 h-5 w-5 '
                    />
                    <InputField
                    type={'search'}
                    placeholder={props.placeholder}
                    value={props.value!}
                    onChange={props.onChange}
                    name={'search'}
                    className='w-1/2 pl-10 pr-4 border border-grey-300 rounded-lg foucus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent'
                    />
                </div>
            </div>
            <div className='flex items-center space-x-4'>
                <div className='relative'>
                <button 
                className='relative p-2 hover:bg-gray-100 rounded-full'
                onClick={()=>setShowNotification(!showNotification)}
                aria-label={`${unreadCount} unread notifications`}
                >
                    <Bell
                    className='h-6 w-6 text-gray-600'
                    />
                    {unreadCount >0 && (
                        <span className='absolute top-0 right-0 h-5 w-5 bg-[#ff8800] text-white text-xs flex items-center justify-center rounded-full'>
                            {unreadCount}
                        </span>
                    )}
                </button>
                <NotificationPanel
                isOpen={showNotification}
                onClose={()=>setShowNotification(false)}
                onReadNotification={handleReadNotification}
                notification={notifications}
                />
                </div>
                    <div className='relative'>
                        <button
                            onClick={()=>setShowProfileMenu(!showProfileMenu)}
                            className={'h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#ff8800] transition-colors'}

                            >
                                <img 
                                src="" 
                                alt="Profile"
                                className='h-full w-full object-cover' />
                        </button>
                        {showProfileMenu && (
                            <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200'>
                                <a href="#"
                                className='flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100'>
                                    <User className='h-4 w-4 mr-2 '/>
                                    Profile

                                </a>
                                <button
                                onClick={()=>console.log('logout')}
                                className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                ><LogOut
                                className='h-4 w-2 mr-2 '/>
                                Logout
                                </button>

                            </div>
                        )}
                    </div>
            </div>
        </div>
    </header>
  )
}

export default Header