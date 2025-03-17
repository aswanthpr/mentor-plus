import { toast } from "react-toastify";
import { Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Home, MessageSquare, Calendar, Video, Wallet, SquareActivity } from "lucide-react";

import { RootState } from "../../Redux/store";
import { axiosInstance } from "../../Config/mentorAxios";
import { markAsRead, setNotification } from "../../Redux/notificationSlice";
import { clearMentorToken } from "../../Redux/mentorSlice";
import Header from "../../components/Common/common4All/Header";
import SidePanel from "../../components/Common/common4All/SidePanel";
import { connectToNotifications, disconnectNotificationSocket } from "../../Socket/connect";

interface INavItem {
  name: string;
  path: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
const navItems: INavItem[] = [
  { name: "Home", path: "/mentor/home", icon: Home },
  { name: "Session", path: "/mentor/session", icon: Video },
  { name: "Messages", path: "/mentor/messages", icon: MessageSquare },
  { name: "Schedule", path: "/mentor/Schedule", icon: Calendar },
  { name: "Wallet", path: "/mentor/wallet", icon: Wallet },
  { name: "Statistics", path: "/mentor/Statistics", icon: SquareActivity },
];


const Mentor_Page: React.FC = () => {
  const dispatch = useDispatch();
  const notification = useSelector(
    (state: RootState) => state?.notificationSlice.mentor
  );
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  useEffect(() => {
    let flag = true;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/mentor/notification`
        );

        if (flag && response?.status == 200 && response.data?.success) {
          const user_Id = response.data?.result?.[0]?.["userId"] as string;

          dispatch(
            setNotification({
              userType: "mentor",
              notification: response.data["result"],
            })
          );
          if (user_Id) {
            connectToNotifications(user_Id, "mentor");
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
  }, [dispatch]);

  const handleReadNotification = async (id: string) => {
    try {
      const response = await axiosInstance.patch(
        `/mentor/notification-read/${id}`
      );

      if (response?.status == 200 && response.data?.success) {
        dispatch(markAsRead({ userType: "mentor", id }));
      }
    } catch (error: unknown) {
      console.log(`${error instanceof Error ? error.message : String(error)}`);
    }
  };
  const ToggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const handleSearchChange = (e: React. ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const mentorLogout = async () => {
    const response = await axiosInstance.post(`/mentor/logout`);
    if (response.data?.success && response?.status == 200) {
      dispatch(clearMentorToken());
      localStorage.removeItem("mentorToken");
      localStorage.removeItem("mentor");

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
        userType="mentor"
        logout={mentorLogout}
        profileLink="/mentor/profile"
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
      <main className={` lg:pl-64 transition-all duration-200`}>
        <div className="p-3 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}; 

export default Mentor_Page;
