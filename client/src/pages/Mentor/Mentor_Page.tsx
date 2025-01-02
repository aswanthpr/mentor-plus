import React,{useState} from 'react'
import Header from '../../components/Common/Ui_Layout/Header'
import { Home,MessageSquare,Calendar,Wallet,HelpCircle, Video} from 'lucide-react';
import SidePanel from '../../components/Common/Ui_Layout/SidePanel';
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
  const [isSideBarOpen,setIsSideBarOpen] = useState<boolean>(true);
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
      {isSideBarOpen&&
      
      <SidePanel
      SideBarItems={navItems}/>
      }
        <main className={` pl-64 ${isSideBarOpen? 'pl-60':'pl-0'}`} >
        <div className="pl-0">
          <Outlet />
        </div>
        </main>
    </div>
  )
}

export default Mentor_Page;