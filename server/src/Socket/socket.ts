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
//Notification============================================================

  private setupNotifications() {
    //notificatin namespace set
    const notificationNamespace = this.io.of("/notifications");

    notificationNamespace.on("connection", (socket: Socket) => {
      console.log(`Notification user connected: ${socket.id}`);
      //join to specific users notification room
      socket.on("join-room", (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined their notification room`);
      });
    //disconnect user
      socket.on("disconnect", () => {
        console.log(`Notification user disconnected: ${socket.id}`);
      });
    });
  }
  // for emitting new notification 
  public sendNotification = (userId: string, message: Inotification) => {
    this.io
      .of("/notifications")
      .to(userId)
      .emit("receive-notification", message);
  };
  
  //chat=====================================================================

  private setupChat() {
    //setting chat name space
    const chatNsp = this.io.of("/chat");

    chatNsp.on("connection", (socket: Socket) => {
      const userId = socket.handshake.auth.token;

      if (!userId) {
        console.error("User is not authenticated");
        socket.disconnect();
        return;
      }
    //verify connection and inserting online user to the map
      if (socket.connected) {
        console.log(`ChatSocket with ID ${socket.id} is connected`);
        chatMap.set(userId, socket?.id);
      }

      // user broadcast online status
      socket.broadcast.emit("userOnline", [...chatMap.keys()]);

      //join the user to a specific room
      socket.on("join-room", async (data) => {
        if (!data?.roomId) return;
        console.log(`user joined in the room`, data?.roomId);
        socket.join(data?.roomId);
        try {
          //fetch all specific roomid message 
          const result = await messageRepository.getMessage(
            new mongoose.Types.ObjectId(
              data?.roomId as string
            ) as unknown as mongoose.Schema.Types.ObjectId
          );
          //send all  messages to the chatnamespace's specific  users roomId 
          chatNsp
            .to(data?.roomId)
            .emit("all-message", { result, roomId: data?.roomId });
        } catch (error: unknown) {
          throw new Error(
            `${error instanceof Error ? error.message : String(error)}`
          );
        }
      });
      //geting new message
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
          
            throw new Error("Message cannot be empty.");
          }
          //create new message
          const result = await messageRepository.createMessage(message);

          if (!result) {
            chatNsp
              .to(roomId)
              .emit("errorMessage", { error: "message not created " });
          }
          //send back the  new  message 
          chatNsp.to(roomId).emit("receive-message", { result, roomId });

          //decode the %$like code from the file name 
          const messageContent =
            message?.messageType == "text"
              ? message?.content
              : decodeURIComponent(message?.content.split("/").pop());

          //setting the last message
          await chatRepository.find_By_Id_And_Update(
            chatSchema,
            message?.chatId as string,
            { $set: { lastMessage: String(messageContent) } }
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
        //remove the disconnected user
        chatMap.delete(userId);

        if (!chatMap.has(userId)) {
          console.log(`User ${userId} removed from chatMap`);
        }

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
