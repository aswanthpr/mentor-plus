import React, { useState, useRef, useEffect } from "react";
import logo from "../../../Asset/mentorPlus.png";
import { AlignJustify, Bell, LogOut, User } from "lucide-react";
// import InputField from '../../auth/InputField';
import NotificationPanel from "./NotificationPanel";
import { Link } from "react-router-dom";
import profile from "../../../Asset/user.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";

const Header: React.FC<IHeader> = React.memo((props) => {
   const users = useSelector((state: RootState) => state.user);
  const { userType, ToggleSideBar, profileLink, logout, onRead, notifData } =
    props;

  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the profile button or profile menu
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        profileMenuButtonRef.current &&
        !profileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount: number | undefined = notifData?.filter(
    (n) => !n.isRead!
  ).length;

  const handleProfileClick = () => {
    setShowProfileMenu(false); // Close menu on profile click
  };
 
  return (
    <header className="bg-white border-b border-gray-200 top-0 left-0 right-0 z-50 fixed ">
      <div className="h-16 px-4 flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <div
            className="lg:hidden"
            onClick={ToggleSideBar}
            aria-label="Toggle Sidebar"
          >
            <AlignJustify className="mr-2 cursor-pointer" />
          </div>

          <img loading="lazy" src={logo} alt="logo" className="w-auto h-24" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="relative p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setShowNotification(!showNotification)}
              aria-label={`${unreadCount} unread notifications`}
            >
              <Bell className="h-6 w-6 text-gray-600" />
              {unreadCount! > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-[#ff8800] text-white text-xs flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel
              isOpen={showNotification}
              onClose={() => setShowNotification(false)}
              onReadNotification={onRead}
              notification={notifData}
            />
          </div>
          <div className="relative">
            <button
              ref={profileMenuButtonRef}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={
                "h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#ff8800] transition-colors"
              }
            >
              <img
                loading="lazy"
                src={users?.image ?? profile}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </button>
            {showProfileMenu && (
              <div
                ref={profileMenuRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-50"
              >
                {userType !== "admin" && (
                  <Link
                    to={profileLink}
                    onClick={handleProfileClick}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-5 w-5 mr-2 mt-0 mb-5" />
                    {
                      (users?.name&&users?.email)?(
                    <div className="flex flex-col">
                      <span>{users?.name}</span>
                      <p className="text-xs text-neutral-600">{users?.email}</p>
                    </div>

                      ):(
                         <div className="flex flex-col">
                      
                      <p className="text-md text-neutral-600 pb-4">Profile</p>
                    </div>
                      )
                    }
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5 mr-2 " />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
