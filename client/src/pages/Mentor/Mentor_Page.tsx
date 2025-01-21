import React,{useState} from 'react'
import Header from '../../components/Common/common4All/Header'
import { Home,MessageSquare,Calendar,Wallet,HelpCircle, Video} from 'lucide-react';
import SidePanel from '../../components/Common/common4All/SidePanel';
import { Outlet } from 'react-router-dom';
import { axiosInstance } from '../../Config/mentorAxios';
import { useDispatch } from 'react-redux';
import { clearMentorToken } from '../../Redux/mentorSlice'; 
import { toast } from 'react-toastify';


interface INavItem{
  name:string;
  path:string;
  icon:React.FC<React.SVGProps<SVGSVGElement>>;
}
const navItems:INavItem[]= [
    { name: 'Home', path: '/mentor/home', icon: Home },
    { name: 'Session', path: '/mentor/session', icon: Video },
    { name: 'Messages', path: '/mentor/messages', icon: MessageSquare },
    { name: 'Schedule', path: '/mentor/Schedule', icon: Calendar },
    { name: 'Wallet', path: '/mentor/wallet', icon: Wallet },
    { name: 'Q&A', path: '/mentor/qa', icon: HelpCircle },
  ];
 
const Mentor_Page:React.FC = () => {
  const dispatch = useDispatch()
  const [isSideBarOpen,setIsSideBarOpen] = useState<boolean>(false);
  const [searchValue,setSearchValue] = useState<string>('');
  
  const ToggleSideBar =()=>{
    setIsSideBarOpen(!isSideBarOpen);
  }

  const handleSearchChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setSearchValue(e.target.value);
  }
  const mentorLogout=async()=>{
  
    const response = await axiosInstance.post(`/mentor/logout`);
    if(response.data.success&&response.status==200){
    
      dispatch(clearMentorToken());
      localStorage.removeItem('mentorToken');
      localStorage.removeItem('mentor');
      
      toast.success(response.data.message);
    }
    
  }
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header
      onChange={handleSearchChange}
      value={searchValue}
      ToggleSideBar={ToggleSideBar} 
      placeholder='Search...'
      userType='mentor'
      logout={mentorLogout}
      profileLink='/mentor/profile'
      />
      {/* Overlay for Small Screens */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSideBarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-40 ${
          isSideBarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <SidePanel SideBarItems={navItems} />
      </div>
        <main className={` lg:pl-64 transition-all duration-200`} >
        <div className="p-6">
          <Outlet />
        </div>
        </main>
    </div>
  )
}
 
export default Mentor_Page;    