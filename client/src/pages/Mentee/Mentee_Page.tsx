import React,{useState} from 'react'
import Header from '../../components/Common/Ui_Layout/Header'
import { Home,Compass,MessageSquare,Calendar,Wallet,HelpCircle,} from 'lucide-react';
import SidePanel from '../../components/Common/Ui_Layout/SidePanel';
import { Outlet } from 'react-router-dom';


interface INavItem{
  name:string;
  path:string;
  icon:React.FC<React.SVGProps<SVGSVGElement>>;
}
const navItems:INavItem[]= [
    { name: 'Home', path: '/mentee/home', icon: Home },
    { name: 'Explore', path: '/mentee/explore', icon: Compass },
    { name: 'Messages', path: '/mentee/messages', icon: MessageSquare },
    { name: 'Bookings', path: '/mentee/bookings', icon: Calendar },
    { name: 'Wallet', path: '/mentee/wallet', icon: Wallet },
    { name: 'Q&A', path: '/mentee/qa', icon: HelpCircle },
  ];
 
const Mentee_Page:React.FC = () => {
  const [isSideBarOpen,setIsSideBarOpen] = useState<boolean>(true);
  const [searchValue,setSearchValue] = useState<string>('');
  
  const ToggleSideBar =()=>{
    setIsSideBarOpen(!isSideBarOpen);
  }

  const handleSearchChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setSearchValue(e.target.value);
  }
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header
      onChange={handleSearchChange}
      value={searchValue}
      ToggleSideBar={ToggleSideBar}
      placeholder='Search...'
      />
      {isSideBarOpen&&
      
      <SidePanel
      SideBarItems={navItems}/>
      }
        <main className={`pt-1 place-self-auto  ${isSideBarOpen? 'pl-64':'pl-0'}`} >
        <div className="p-0 mx-auto">
          <Outlet />
        </div>
        </main>
    </div>
  )
}

export default Mentee_Page