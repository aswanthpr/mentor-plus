import React from "react";
import { Bell, X } from "lucide-react";
// import Button from "../../auth/Button";
import NotificationItems from "./NotificationItem";
import { INotification } from "./NotificationItem";
interface INotificationPanel {
  isOpen: boolean;
  onClose: () => void;
  notification: INotification[];
  onReadNotification: (id: string) => void;
}

const NotificationPanel: React.FC<INotificationPanel> = ({
  isOpen,
  onClose,
  notification,
  onReadNotification,
}) => {
  if (!isOpen) return null;
  const unreadCount = notification.filter((n) => !n.read).length;
  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2 ">
            <Bell className="h-5 w-5 text-[#ff8800]" />
            <h3 className="text-lg font-semibold ">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-[#ff8800] text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            className={"text-gray-400 hover:text-gray-600 transition-colors"}
            onClick={onClose}
            aria-label="Close notifications panel"
          >
            <X className="h-5 w-5" />
           
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
        {notification.length > 0 ? (
          notification.map((notify) => (
            <NotificationItems
              key={notify.id}
              notification={notify}
              onRead={onReadNotification}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No notifictions yet
          </div>
        )}
      </div>
      {notification.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <button className=" w-full text-center text-sm text-[#ff8800] hover:text-[#ff9900] font-bold">
          View all Notification
             </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
