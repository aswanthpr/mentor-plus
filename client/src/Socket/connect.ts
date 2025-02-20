import {io, Socket} from 'socket.io-client';

export const SOCKET_URL = "http://localhost:3000";

export let webrtcSocket: Socket | null = null;
export let chatSocket: Socket | null = null;
export let notificationSocket: Socket | null = null;
//  connect to WebRTC namespace
export const connectToWebRTC = (): Socket => {
  if (!webrtcSocket) {
    webrtcSocket = io(`${SOCKET_URL}/webrtc`);
  }
  return webrtcSocket;
}
//  connect to Chat namespace
export const connectToChat = (): Socket => {
  if (!chatSocket) {
    chatSocket = io(`${SOCKET_URL}/chat`);
  }
  return chatSocket;
};

// connect to Notifications namespace
export const connectToNotifications = (): Socket => {
  if (!notificationSocket) {
    notificationSocket = io(`${SOCKET_URL}/notifications`);
  }
  return notificationSocket;
};

// Optional: Disconnect all socket instances
export const disconnectAll = () => {
  if (webrtcSocket) webrtcSocket.disconnect();
  if (chatSocket) chatSocket.disconnect();
  if (notificationSocket) notificationSocket.disconnect();
};

