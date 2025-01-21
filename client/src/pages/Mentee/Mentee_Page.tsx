import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Home, Compass, MessageSquare, Calendar, Wallet, HelpCircle } from 'lucide-react';
import Header from '../../components/Common/common4All/Header';
import SidePanel from '../../components/Common/common4All/SidePanel';
import { clearAccessToken } from '../../Redux/menteeSlice';
import { protectedAPI } from '../../Config/Axios';
import { toast } from 'react-toastify';

interface INavItem {
  name: string;
  path: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const navItems: INavItem[] = [
  { name: 'Home', path: '/mentee/home', icon: Home },
  { name: 'Explore', path: '/mentee/explore', icon: Compass },
  { name: 'Messages', path: '/mentee/messages', icon: MessageSquare },
  { name: 'Bookings', path: '/mentee/bookings', icon: Calendar },
  { name: 'Wallet', path: '/mentee/wallet', icon: Wallet },
  { name: 'Q&A', path: '/mentee/qa', icon: HelpCircle },
];

const Mentee_Page: React.FC = () => {
  const dispatch = useDispatch();

  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const ToggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const logoutMentee = async () => {
    const response = await protectedAPI.post(`/mentee/logout`);
    if (response.data.success && response.status === 200) {
      dispatch(clearAccessToken());
      localStorage.removeItem('menteeToken');
      toast.success(response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onChange={handleSearchChange}
        value={searchValue}
        ToggleSideBar={ToggleSideBar}
        placeholder="Search..."
        profileLink="/mentee/profile"
        userType="mentee"
        logout={logoutMentee}
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

      {/* Main Content */}
      <main className={` lg:pl-64 transition-all duration-200`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Mentee_Page;
