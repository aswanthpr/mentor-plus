import React, { useCallback, useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import { markAsRead, setNotification } from "../../Redux/notificationSlice";
import { RootState } from "../../Redux/store";
import {
  connectToNotifications,
  disconnectNotificationSocket,
} from "../../Socket/connect";
import {
  fetchLogout,
  fetchNotification,
  ReadNotification,
} from "../../service/menteeApi";
import { HttpStatusCode } from "axios";


const navItems: INavItem[] = [
  { name: "Home", path: "/mentee/home", icon: Home },
  { name: "Explore", path: "/mentee/explore", icon: Compass },
  { name: "Bookings", path: "/mentee/bookings", icon: Calendar },
  { name: "Messages", path: "/mentee/messages", icon: MessageSquare },
  { name: "Wallet", path: "/mentee/wallet", icon: Wallet },
  { name: "Q&A", path: "/mentee/qa", icon: HelpCircle },
];

const Mentee_Page: React.FC = () => {
  const dispatch = useDispatch();
  const notification = useSelector(
    (state: RootState) => state?.notificationSlice.mentee
  );

  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  
  useEffect(() => {
    let flag = true;

    const fetchData = async () => {
      const response = await fetchNotification();

      if (
        flag &&
        response?.status == HttpStatusCode?.Ok &&
        response?.data.success
      ) {
        const user_Id = response?.data.result?.[0]?.["userId"] as string;

        dispatch(
          setNotification({
            userType: "mentee",
            notification: response?.data?.["result"],
          })
        );
        if (user_Id) {
          connectToNotifications(user_Id, "mentee");
        }
      }
    };
    const timer = setTimeout(() => {
      fetchData();
    }, 3000);
    return () => {
      flag = false;
      clearTimeout(timer);
      disconnectNotificationSocket()
    };
  }, [dispatch]);

  const ToggleSideBar = useCallback(() => {
    setIsSideBarOpen(!isSideBarOpen);
  }, [isSideBarOpen]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );

  const logoutMentee = useCallback(async () => {
    const response = await fetchLogout();
    if (response.data.success && response.status === HttpStatusCode?.Ok) {
      dispatch(clearAccessToken());
      localStorage.removeItem("menteeToken");
      toast.success(response.data.message);
    }
  }, [dispatch]);

  const handleReadNotification = useCallback(
    async (id: string) => {
      const response = await ReadNotification(id);

      if (response?.status == HttpStatusCode?.Ok && response?.data.success) {
        dispatch(markAsRead({ userType: "mentee", id }));
      }
    },
    [dispatch]
  );
  return (
    // <div className="min-h-screen bg-gray-50">
    <div className="h-10 w-full  shadow-sm">
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
        <div className="p-3  ">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Mentee_Page;
