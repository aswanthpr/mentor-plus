import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/Common/common4All/Header";
import {
  PaperclipIcon,
  LayoutDashboard,
  HelpCircle,
  UserRoundPenIcon,
  Users,
} from "lucide-react";
import SidePanel from "../../components/Common/common4All/SidePanel";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../Redux/adminSlice";
import { toast } from "react-toastify";
import { markAsRead, setNotification } from "../../Redux/notificationSlice";
import { RootState } from "../../Redux/store";
import {
  fetchAdminLogout,
  fetchAllNotification,
  fetchNotificaitionRead,
} from "../../service/adminApi";
import { HttpStatusCode } from "axios";
import { connectToNotifications, disconnectNotificationSocket } from "../../Socket/connect";

const navItems: INavItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Category", path: "/admin/category_management", icon: PaperclipIcon },
  { name: "Mentor", path: "/admin/mentor_management", icon: UserRoundPenIcon },
  { name: "Mentee", path: "/admin/mentee_management", icon: Users },
  { name: "Q&A", path: "/admin/qa_management", icon: HelpCircle },
];

const Admin_Page: React.FC = () => {
  const dispatch = useDispatch();
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const notification = useSelector(
    (state: RootState) => state?.notificationSlice.admin
  );

  useEffect(() => {
    let flag = true;

    const fetchData = async () => {
      const response = await fetchAllNotification();

      if (
        flag &&
        response?.status == HttpStatusCode?.Ok &&
        response?.data.success
      ) {
        dispatch(
          setNotification({
            userType: "admin",
            notification: response?.data?.result,
          })
        );
        const user_Id = response?.data.result?.[0]?.["userId"] as string;
     
        if (user_Id) {
          connectToNotifications(user_Id, "mentee");
        }
      }
    };
    const timer = setTimeout(() => {
      fetchData();
    }, 2000);
    return () => {
      clearTimeout(timer);
      flag = false;
      disconnectNotificationSocket();
    };
  }, [dispatch]);

  const ToggleSideBar = useCallback(() => {
    setIsSideBarOpen(!isSideBarOpen);
  }, [isSideBarOpen]);

  const handleReadNotification = useCallback(
    async (id: string) => {
      const response = await fetchNotificaitionRead(id);

      if (response?.status == HttpStatusCode?.Ok && response?.data.success) {
        dispatch(markAsRead({ userType: "admin", id }));
        
      }
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );
  const adminLogout = useCallback(async () => {
    const response = await fetchAdminLogout();

    if (response.data.success && response.status == 200) {
      dispatch(clearToken());

      toast.success(response.data.message);
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onChange={handleSearchChange}
        value={searchValue}
        ToggleSideBar={ToggleSideBar}
        placeholder="Search..."
        userType="admin"
        logout={adminLogout}
        profileLink=""
        notifData={notification}
        onRead={handleReadNotification}
      />
      {isSideBarOpen && <SidePanel SideBarItems={navItems} />}
      <main
        className={`pt-1 place-self-auto  ${isSideBarOpen ? "pl-64" : "pl-0"}`}
      >
        <div className="p-0 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Admin_Page;
