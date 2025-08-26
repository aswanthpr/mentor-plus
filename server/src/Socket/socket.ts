// webrtc here using the socket io for signaling;

import { Server, Socket } from "socket.io";
import { Inotification } from "../Model/notificationModel";
import messageRepository from "../Repository/implementation/messageRepository";
import mongoose from "mongoose";
import chatRepository from "../Repository/implementation/chatRepository";
import chatSchema from "../Model/chatSchema";

import slotScheduleRepository from "../Repository/implementation/slotScheduleRepository";
import { IslotScheduleRepository } from "../Repository/interface/iSlotScheduleRepository";
const _slotScheduleRepo: IslotScheduleRepository = slotScheduleRepository;

const chatMap = new Map();
const rooms = new Map(); //webrtc
export class SocketManager {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }
  public initialize() {
    this.setupChat();
    this.setupNotifications();
    this.setupWebRTC();
  }
  //Notification============================================================

  private setupNotifications() {
    //notificatin namespace set
    const notificationNamespace = this.io.of("/notifications");

    notificationNamespace.on("connection", (socket: Socket) => {
      //join to specific users notification room
      socket.on("join-room", (userId: string) => {
        socket.join(userId);
      });
      //disconnect user
      socket.on("disconnect", () => {
        // console.log(`Notification user disconnected: ${socket.id}`);
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
        // console.error("User is not authenticated");
        socket.disconnect();
        return;
      }
      //verify connection and inserting online user to the map
      if (socket.connected) {
        // console.log(`ChatSocket with ID ${socket.id} is connected`);
      }
      chatMap.set(userId, socket?.id);

      // user emit online status
      chatNsp.emit("userOnline", [...chatMap.keys()]);

      //join the user to a specific room
      socket.on("join-room", async (data) => {
        if (!data?.roomId) return;

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
        try {
          if (!roomId) {
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
              : message?.messageType;

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

          // Send error message to the client
          chatNsp.emit("errorMessage", { error: error });
        }
      });

      socket.on("disconnect", () => {
        //remove the disconnected user
        chatMap.delete(userId);

        //emit if user is goes to offline
        chatNsp.emit("userOffline", userId); // Notify  user went offline
        chatNsp.emit("userOnline", [...chatMap.keys()]);
      });
    });
  }
  //============================================================================
  private setupWebRTC() {
    const webrtcNamespace = this.io.of("/webrtc");

    webrtcNamespace.on("connection", (socket: Socket) => {
      // console.log(`WebRTC user connected: ${socket.id}`);

      socket.on("join-call", async ({ roomId, sessionId, userId }) => {
        const result = await _slotScheduleRepo.validateSessionJoin(
          new mongoose.Types.ObjectId(
            sessionId as string
          ) as unknown as mongoose.Schema.Types.ObjectId,
          roomId,
          new mongoose.Types.ObjectId(
            userId as string
          ) as unknown as mongoose.Schema.Types.ObjectId
        );

        if (!result) {
          socket.emit("join-fail", "Invalid session or user");
          socket.disconnect();
          return;
        }

        socket.join(roomId);
        // console.log(
        //   `User ${socket.id} joined room: ${roomId}`
        // );

        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }
        rooms.get(roomId).add(socket.id);

        socket.to(roomId).emit("user-joined", socket.id);
      });

      socket.on("offer", (offer, roomId) => {
        // console.log(`Offer received in room ${roomId}`);
        socket.to(roomId).emit("offer", offer, socket.id);
      });

      socket.on("answer", (answer, roomId) => {
        // console.log(`Answer received in room ${roomId}`);
        socket.to(roomId).emit("answer", answer);
      });

      socket.on("ice-candidate", (candidate, roomId) => {
        // console.log(`ICE Candidate received in room ${roomId}`);
        socket.to(roomId).emit("ice-candidate", candidate);
      });

      socket.on("video:toggle", ({ isMuted, roomId }) => {
        // console.log(
        //   `Video toggle received from ${socket.id} in room ${roomId}`
        // );

        // Notify all other users in the room
        socket.to(roomId).emit("video:toggle", { userId: socket.id, isMuted });
      });

      socket.on("disconnect", () => {
        rooms.forEach((users, roomId) => {
          if (users.has(socket.id)) {
            users.delete(socket.id);
            if (users.size === 0) {
              rooms.delete(roomId);
            }
            webrtcNamespace.to(roomId).emit("user-disconnected", socket.id);
          }
        });
      });
    });
  }
}
