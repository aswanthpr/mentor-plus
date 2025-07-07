import { addNewNotification } from "../Redux/notificationSlice";
import { io, Socket } from "socket.io-client";
import { store } from "../Redux/store";

let notificationSocket: Socket | null = null;
let chatSocket: Socket | null = null;

// connect to Notifications namespace
export const connectToNotifications = (userId: string, userType: Tuser) => {
  if (!userId) return;

  if (!notificationSocket) {
    notificationSocket = io(
      `${import.meta.env?.VITE_SERVER_URL}/notifications`,
      {
        withCredentials: true,
        autoConnect: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 3000,
      }
    );

    notificationSocket.on("connect", () => {
     
      //joining roomreceive-notification
      notificationSocket!.emit("join-room", userId);
    });
    //handle incoming notification
    notificationSocket.on("receive-notification", (message) => {
     
      //data to redux
      store.dispatch(addNewNotification({ userType, notification: message }));
    });

    notificationSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return notificationSocket;
};
export const disconnectNotificationSocket = () => {
  if (notificationSocket) {
    notificationSocket.disconnect();
    notificationSocket = null;
   
  }
};
//  connect to Chat namespace===========================================
export const connectToChat = (userId: string) => {
  if (!userId) return;
  if (!chatSocket) {
    chatSocket = io(`${import.meta.env?.VITE_SERVER_URL}/chat`, {
      withCredentials: true,
      auth: { token: userId },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 2000,
      autoConnect: true,
      reconnectionAttempts: 10,
    });
  }
  return chatSocket;
};
export const disconnectChat = () => {
  if (chatSocket) {
    chatSocket.disconnect();
    chatSocket = null;
  }
};

