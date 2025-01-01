import React, { useState } from 'react'
import Header from '../../components/Common/Ui_Layout/Header'
import { PaperclipIcon, LayoutDashboard, HandCoins, HelpCircle, UserRoundPenIcon, Users } from 'lucide-react';
import SidePanel from '../../components/Common/Ui_Layout/SidePanel';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { API } from '../../Config/adminAxios';
import { clearToken } from '../../Redux/adminSlice';
import { toast } from 'react-toastify';


interface INavItem {
  name: string;
  path: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
const navItems: INavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Category', path: '/admin/category_management', icon: PaperclipIcon },
  { name: 'Mentor', path: '/admin/mentor_management', icon: UserRoundPenIcon },
  { name: 'Mentee', path: '/admin/mentee_management', icon: Users },
  { name: 'Payment', path: '/admin/payment_management', icon: HandCoins },
  { name: 'Q&A', path: '/admin/qa_management', icon: HelpCircle },
];

const Admin_Page: React.FC = () => {
  const dispatch = useDispatch()
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');

  const ToggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }
 const adminLogout= async()=>{
const response = await API.post(`/admin/logout`);
if(response.data.success&&response.status==200){

  dispatch(clearToken());
  localStorage.removeItem('adminToken');
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
        userType='admin'
        logout={adminLogout}
        profileLink=''
      />
      {isSideBarOpen &&

        <SidePanel
          SideBarItems={navItems} />
      }
      <main className={`pt-1 place-self-auto  ${isSideBarOpen ? 'pl-64' : 'pl-0'}`} >
        <div className="p-0 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Admin_Page