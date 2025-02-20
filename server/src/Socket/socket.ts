// webrtc here using the socket io for signaling;
import { Server, Socket } from "socket.io";
import chatRepository from "../Repository/chatRepository";
import chatSchema, { Ichat } from "../Model/chatSchema";
import messageSchema, { Imessage } from "../Model/messageSchema";
import { Imentor } from "../Model/mentorModel";
import { IchatWithUser } from "../Types";
import mongoose from "mongoose";

let users = new Map();

export class SocketManager {
  private io: Server;
  constructor(io: Server) {
    this.io = io;
  }
  public initialize() {
    // this.setupWebRTC();
    this.setupChat();
    // this.setupNotifications();
  }

  private setupWebRTC() {
    const webrtcNamespace = this.io.of("/webrtc");

    webrtcNamespace.on("connection", (socket: Socket) => {
      console.log(`WebRTC user connected: ${socket.id}`);

      socket.on("offer", (data) => {
        socket
          .to(data.target)
          .emit("offer", { sdp: data.sdp, from: socket.id });
      });

      socket.on("answer", (data) => {
        socket.to(data.target).emit("answer", { sdp: data.sdp });
      });

      socket.on("ice-candidate", (data) => {
        socket.to(data.target).emit("ice-candidate", data.candidate);
      });

      socket.on("disconnect", () => {
        console.log(`WebRTC user disconnected: ${socket.id}`);
      });
    });
  }

  private setupChat() {
    const chatNamespace = this.io.of("/chat");

    chatNamespace.on("connection", (socket: Socket) => {
      if (socket.connected) {
        console.log(`Socket with ID ${socket.id} is connected`);
      }
      //when user starts chating they where register to chat section
      socket.on("register", (userId) => {
        users.set(socket.id, userId);
        console.log(
          `user ${userId} is connected with socketId ${socket.id} and `
        );
        console.log("success ");
      });

      socket.on("checkOnline", (userId: string) => {
        if (userId && [...users.values()].includes(userId)) {
          socket.emit("userOnline", { userId, online: true });
          console.log("useronline");
        } else {
          socket.emit("userOnline", { userId, online: false });
        }
      });

      //join them to the room

      socket.on("join_room", (roomId: string, userId: string) => {
        if (roomId) {
          socket.join(roomId);
          console.log(`User ${userId} joined room ${roomId}`);
          socket.to(roomId).emit("room_joined", { userId, roomId });
        } else {
          console.log("User not connected to room online");
        }
      });

      socket.on(`sendMessage`, async(data: Imessage) => {
        const {
          chatId,
          senderId,
          receiverId,
          senderType,
          mediaUrl,
          messageType,
          content,
        } = data;
        if (
          !chatId ||
          !senderId ||
          !receiverId ||
          !senderType ||
          !messageType ||
          !content ||
          !mediaUrl
        ) {
          socket
            .to(String(chatId))
            .emit("receiveMessage", {
              message: "credential not received",
              result: null,
            });
        }
        console.log(`send message form
            ${senderId} to ${receiverId}`);

            let mentorId,menteeId;
            if(senderType=="mentee"){
                menteeId=senderId
                mentorId = receiverId

            }else{
                menteeId = receiverId
                mentorId  = senderId
            }
            const chatExist = await chatRepository.find_One({menteeId,mentorId,});
            if(!chatExist){
                // socket
            // .to(String(chatId))
            // .emit("receiveMessage", {
            //   message: "credential not received",
            //   result: null,
            // });
            // await chatRepository.createDocument({
            //     menteeId,
            //     mentorId,
            // })
            }

      });
      // socket.on("send-message", (data) => {
      //   socket.to(data.target).emit("receive-message", {
      //     message: data.message,
      //     from: socket.id,
      //   });
      // });

      // Emit a connection event to the client
      socket.on("disconnect", () => {
        console.log(`Chat user disconnected: ${socket.id}`);
      });
    });
  }

  // private setupNotifications() {
  //   const notificationNamespace = this.io.of("/notifications");

  //   notificationNamespace.on("connection", (socket: Socket) => {
  //     console.log(`Notification user connected: ${socket.id}`);

  //     socket.on("send-notification", (data) => {
  //       socket.to(data.target).emit("receive-notification", {
  //         message: data.message,
  //         from: socket.id,
  //       });
  //     });

  //     socket.on("disconnect", () => {
  //       console.log(`Notification user disconnected: ${socket.id}`);
  //     });
  //   });
  // }
}
