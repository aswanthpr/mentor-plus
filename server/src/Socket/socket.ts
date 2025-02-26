// webrtc here using the socket io for signaling;

import { Server, Socket } from "socket.io";
import { Inotification } from "../Model/notificationModel";
import messageRepository from "../Repository/messageRepository";
import mongoose from "mongoose";
import chatRepository from "../Repository/chatRepository";
import chatSchema from "../Model/chatSchema";

const chatMap = new Map();

export class SocketManager {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }
  public initialize() {
    this.setupChat();
    this.setupNotifications();
    // this.setupWebRTC();
  }

  private setupNotifications() {
    const notificationNamespace = this.io.of("/notifications");

    notificationNamespace.on("connection", (socket: Socket) => {
      console.log(`Notification user connected: ${socket.id}`);

      socket.on("join-room", (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined their notification room`);
      });

      socket.on("disconnect", () => {
        console.log(`Notification user disconnected: ${socket.id}`);
      });
    });
  }
  public sendNotification = (userId: string, message: Inotification) => {
    this.io
      .of("/notifications")
      .to(userId)
      .emit("receive-notification", message);
  };
  //chat===========================================

  private setupChat() {
    const chatNsp = this.io.of("/chat");

    chatNsp.on("connection", (socket: Socket) => {
      const userId = socket.handshake.auth.token;

      if (!userId) {
        console.error("User is not authenticated");
        socket.disconnect();
        return;
      }

      if (socket.connected) {
        console.log(`ChatSocket with ID ${socket.id} is connected`,)
        chatMap.set(userId, socket?.id);
      }

      // user broadcast online status
      socket.broadcast.emit("userOnline", [...chatMap.keys()] );

      socket.on("join-room", async (data) => {
        if (!data?.roomId) return;
        console.log(`user joined in the room`, data?.roomId);
        socket.join(data?.roomId);
        try {
          const result = await messageRepository.getMessage( new  mongoose.Types.ObjectId(data?.roomId as string) as unknown as  mongoose.Schema.Types.ObjectId)
         
          

          chatNsp.to(data?.roomId).emit('all-message', { result, roomId: data?.roomId });

        } catch (error: unknown) {
          throw new Error(`${error instanceof Error ? error.message : String(error)}`)
        }
      });

      socket.on("new-message", async ({ roomId, message }) => {
        console.log(
          `Message to Room ${roomId}: ${message}`,
          message?.senderId,
          message?.chatId,
          message?.receiverId,
          message?.content,
          message?.senderType,
          message?.messageType
        );
        try {
          if (!roomId) {
            console.log("no room");
            throw new Error("Invalid or missing roomId.");
          }
          if (
            !message ||
            !message?.senderId ||
            !message?.chatId ||
            !message?.receiverId ||
            !message?.content?.trim() ||
            !message?.senderType ||
            !message?.messageType
          ) {
            //&& !message?.mediaUrl)
           
            throw new Error("Message cannot be empty.");
          }

          const result = await messageRepository.createMessage(message);
          
          if (!result) {
            chatNsp
            .to(roomId)
            .emit("errorMessage", { error: "message not created " });
          }
          
          chatNsp.to(roomId).emit("receive-message", { result, roomId });
          const messageContent = message?.messageType=='text'?message?.content:  decodeURIComponent( message?.content.split('/').pop())
           console.log('hai',messageContent); 
         
           await chatRepository.find_By_Id_And_Update(
            chatSchema,
           message?.chatId as string,
            { $set: { lastMessage: String(messageContent) } 
          }
          );

        } catch (error: unknown) {
          console.error(
            "Error in sendMessageToRoom:",
            error instanceof Error ? error.message : String(error)
          );

          // ✅ Send error message to the client
          chatNsp.emit("errorMessage", { error: error });
        }
      });
      socket.on("disconnect", () => {
        console.log(`chatSocket with ID ${socket.id} is disconnected`);
        chatMap.delete(userId);
        console.log(chatMap.has(userId),'user exist or not ')
        //broadcast if user is goes to offline
        socket.broadcast.emit("userOffline", [...chatMap.keys()]);
      });
    });
  }
}
//============================================================================
//=============================================================================
// private setupWebRTC() {
//   const webrtcNamespace = this.io.of("/webrtc");

//   webrtcNamespace.on("connection", (socket: Socket) => {
//     console.log(`WebRTC user connected: ${socket.id}`);

//     socket.on("offer", (data) => {
//       socket
//         .to(data.target)
//         .emit("offer", { sdp: data.sdp, from: socket.id });
//     });

//     socket.on("answer", (data) => {
//       socket.to(data.target).emit("answer", { sdp: data.sdp });
//     });

//     socket.on("ice-candidate", (data) => {
//       socket.to(data.target).emit("ice-candidate", data.candidate);
//     });

//     socket.on("disconnect", () => {
//       console.log(`WebRTC user disconnected: ${socket.id}`);
//     });
//   });
// }
