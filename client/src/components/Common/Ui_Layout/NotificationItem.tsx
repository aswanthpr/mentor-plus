import React from "react";

export interface INotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "message" | "booking" | "system";
}
interface INotificationitem {
  notification: INotification;
  onRead: (id: string) => void;
}

const NotificationItems: React.FC<INotificationitem> = ({
  notification,
  onRead,
}) => {
  return (
    <div
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.read ? "bg-blue-50/50" : ""
      }`}
      onClick={() => onRead(notification.id)}
    >
      <div className="flex items-start gap-x-3 ">
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${
              !notification.read ? "text-gray-900" : "text-gray-600"
            }`}
          >
            {notification.title}
          </p>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {notification.message}
          </p>
          {/* <p className='mt-1 text-xs text-gray-400 '>
    {timeAgo}
    </p> */}
        </div>
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-[#ff8800]" />
        )}
      </div>
    </div>
  );
};

export default NotificationItems;
