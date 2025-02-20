
import { chatSocket } from "./connect";

export const registerUser = (userId: string): void => {
  chatSocket?.emit("register", userId);
};

export const disconnect = (event: string) => {
  chatSocket?.off(`${event}`);
};
export const checkOnline = (userId: string) => {
  chatSocket?.emit("checkOnline", userId);
  console.log("useronline emit");
};

export const joinRoom = (roomId: string, userId: string) => {
  chatSocket?.emit("join_room", roomId, userId);
  console.log("Joined room:", roomId);
};
export const listenOnline = (
  callback: (data: { userId: string; online: boolean }) => void
) => {
  chatSocket?.on("userOnline", (data) => {
    callback(data);
    console.log(data, "userOnline listne online");
  });
};

export const listenRoomJoined = (
  callback: (data: { userId: string; chatId: string }) => void
) => {
  chatSocket?.on("room_joined", (data) => {
    callback(data);
    console.log("Room joined:", data);
  });
};

export const sendMessage = (
  chatId: string,
  senderId: string,
  receiverId: string,
  senderType: string,
  content: string,
  messageType: string|undefined,
  mediaUrl: string|undefined
) => {
  chatSocket?.emit("sendMessage", {
    chatId,
    senderId,
    receiverId,
    senderType,
    content,
    messageType,
    mediaUrl,
  });
};
