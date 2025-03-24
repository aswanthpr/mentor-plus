import { formatDistanceToNow } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";

const NotificationItems: React.FC<INotificationitem> = React.memo(
  ({ notification, onRead }) => {
    return (
      <div
        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
          !notification?.isRead ? "bg-blue-50/50" : ""
        }`}
        onClick={() => onRead(notification?._id)}
      >
        <div className="flex items-start gap-x-3 ">
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium ${
                !notification?.isRead ? "text-gray-900" : "text-gray-600"
              } font-medium`}
            >
              {notification?.title}
            </p>
            <Link
              className="mt-1 text-sm text-gray-500 line-clamp-2 hover:text-gray-400"
              to={notification?.url as string}
              children={notification?.message}
            />
            <p className="mt-1 text-xs text-gray-400 ">
              {formatDistanceToNow(new Date(notification?.createdAt))} ago
            </p>
          </div>
          {!notification?.isRead && (
            <div className="w-2 h-2 rounded-full bg-[#ff8800]" />
          )}
        </div>
      </div>
    );
  }
);

export default NotificationItems;
