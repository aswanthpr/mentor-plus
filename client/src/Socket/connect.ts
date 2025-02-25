import { io, Socket } from "socket.io-client";
import { store } from "../Redux/store";
import { addNewNotification } from "../Redux/notificationSlice";
import { Tuser } from "../Types/type";

let notificationSocket: Socket | null = null;
let chatSocket: Socket | null = null;
// export let webrtcSocket: Socket | null = null;

// connect to Notifications namespace
export const connectToNotifications = (userId: string, userType: Tuser) => {
  if (!userId)return;
  
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
      console.log("socket connected  ", notificationSocket?.id);
      //joining room
      notificationSocket!.emit("join-room", userId);
    });
    //handle incoming notification
    notificationSocket.on("receive-notification", (message) => {
      console.log("Notification received:", message);
      //data to redux
      store.dispatch(addNewNotification({ userType, notification: message }));
    });

    notificationSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return notificationSocket
};
export const disconnectNotificationSocket = () => {
  if (notificationSocket) {
    notificationSocket.disconnect();
    notificationSocket = null;
    console.log("Socket disconnected and cleaned up");
  }
};
//  connect to Chat namespace===========================================
export const connectToChat = (userId: string) => {
  if (!userId) return;
  if (!chatSocket) {
    chatSocket = io(`${import.meta.env?.VITE_SERVER_URL}/chat`, {
      withCredentials: true,
      auth: { token: userId },
      reconnection: true,
      reconnectionDelay: 2000,
      autoConnect: true,
      reconnectionAttempts:10,
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

// //  connect to WebRTC namespace
// export const connectToWebRTC = (): Socket => {
//   if (!webrtcSocket) {
//     webrtcSocket = io(`${import.meta.env?.VITE_SERVER_URL}/webrtc`);
//   }
//   return webrtcSocket;
// }

// // Optional: Disconnect all socket instances
// export const disconnectinueAll = () => {
//   // if (webrtcSocket) webrtcSocket.disconnect();
//   if (chatSocket) chatSocket.disconnect();
//   if (notificationSocket) notificationSocket.disconnect();
// };
