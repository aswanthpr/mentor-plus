import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import {
  Home,
  Compass,
  MessageSquare,
  Calendar,
  Wallet,
  HelpCircle,
} from "lucide-react";
import Header from "../../components/Common/common4All/Header";
import SidePanel from "../../components/Common/common4All/SidePanel";
import { clearAccessToken } from "../../Redux/menteeSlice";
import { protectedAPI } from "../../Config/Axios";
import { toast } from "react-toastify";
import { markAsRead, setNotification } from "../../Redux/notificationSlice";
import { RootState } from "../../Redux/store";
import { connectToNotifications, disconnectNotificationSocket } from "../../Socket/connect";

interface INavItem {
  name: string;
  path: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const navItems: INavItem[] = [
  { name: "Home", path: "/mentee/home", icon: Home },
  { name: "Explore", path: "/mentee/explore", icon: Compass },
  { name: "Messages", path: "/mentee/messages", icon: MessageSquare },
  { name: "Bookings", path: "/mentee/bookings", icon: Calendar },
  { name: "Wallet", path: "/mentee/wallet", icon: Wallet },
  { name: "Q&A", path: "/mentee/qa", icon: HelpCircle },
];

const Mentee_Page: React.FC = () => {
  const dispatch = useDispatch();
  const notification = useSelector(
    (state: RootState) => state?.notificationSlice.menteeNotification
  );

  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [userId,setUserId] = useState<string>("")

  useEffect(() => {
    let flag = true;

    const fetchData = async () => {
      try {
        const { data, status } = await protectedAPI.get(`/mentee/notification`);
      
        if (flag && status == 200 && data.success) {
          const user_Id = data.result[0]['userId'] as string;
          setUserId(user_Id);
          dispatch(
            setNotification({ userType: "mentee", notification: data['result'] })
          );
          if(user_Id){

            connectToNotifications(userId,'mentee')
          }
        }
      } catch (error: unknown) {
        console.log(
          `${error instanceof Error ? error.message : String(error)}`
        );
      }
    };

    fetchData();
    return () => {
      flag = false;
      disconnectNotificationSocket();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

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
      localStorage.removeItem("menteeToken");
      toast.success(response.data.message);
    }
  };
  const handleReadNotification = async (id: string) => {
    try {
      const { status, data } = await protectedAPI.patch(
        `/mentee/notification-read/${id}`
      );

      if (status == 200 && data.success) {
        dispatch(markAsRead({ userType: "mentee", id }));
      }
    } catch (error: unknown) {
      console.log(`${error instanceof Error ? error.message : String(error)}`);
    }
  };
  return (
    <div className="h-screen bg-gray-50">
      <Header
        onChange={handleSearchChange}
        value={searchValue}
        ToggleSideBar={ToggleSideBar}
        placeholder="Search..."
        profileLink="/mentee/profile"
        userType="mentee"
        logout={logoutMentee}
        onRead={handleReadNotification}
        notifData={notification}
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
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <SidePanel SideBarItems={navItems} />
      </div>

      {/* Main Content */}
      <main className={` lg:pl-64 transition-all duration-200`}>
        <div className="p-6  ">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Mentee_Page;
