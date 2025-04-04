import React, { useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import NotificationItems from "./NotificationItem";

const NotificationPanel: React.FC<INotificationPanel> = React.memo(
  ({ isOpen, onClose, onReadNotification, notification }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          panelRef.current &&
          !panelRef.current.contains(event.target as Node)
        ) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      // Cleanup the event listener
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, onClose]);
    if (!isOpen) return null;
    const unreadCount = notification?.filter((n) => !n.isRead).length;

    return (
      <div
        ref={panelRef}
        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50  max-h-96 flex flex-col"
      >
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
          {notification?.length > 0 ? (
            notification.map((notify) => (
              <NotificationItems
                key={notify._id}
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
            <button
              disabled
              className=" w-full text-center text-sm text-[#ff8800] hover:text-[#ff9900] font-bold"
            >
              View all Notification
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default NotificationPanel;
