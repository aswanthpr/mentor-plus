// webrtc here using the socket io for signaling;

import { Server, Socket } from "socket.io";
import { Inotification } from "../Model/notificationModel";
import messageRepository from "../Repository/messageRepository";

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
        console.log(`ChatSocket with ID ${socket.id} is connected`);
        // user broadcast online status
      }
      socket.broadcast.emit("userOnline", { userId });
      chatMap.set(userId, socket?.id);

      socket.on("join-room", (data) => {
        console.log(data, "this is the data");
        socket.join(data?.roomId);
        console.log(`user joined in the room`);
      });

      socket.on("new-message", async ({ roomId, message }) => {
        console.log(`Message to Room ${roomId}: ${message}`,message?.senderId ,
          message?.chatId ,
          message?.receiverId ,
          message?.content ,message?.mediaUrl,
          message?.senderType ,
          message?.messageType);
        try {
          if (!roomId) {
            console.log('no room')
            throw new Error("Invalid or missing roomId.");
          }
          if (
            !message ||
            !message?.senderId ||
            !message?.chatId ||
            !message?.receiverId ||
            !message?.content ||
            !message?.senderType ||
            !message?.messageType
          ) {
            console.log('no message')
            throw new Error("Message cannot be empty.");
          }
         const result = await messageRepository.createMessage(message);
         if(!result){

           chatNsp.to(roomId).emit("errorMessage", { error: "message not created " });
         }
         chatNsp.to(roomId).emit("receive-message", {result,roomId});
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
        //broadcast if user is goes to offline
        socket.broadcast.emit("userOffline", { userId });

      });
    });

    // chatNamespace.on("connection", (socket: Socket) => {
    //   if (socket.connected) {
    //     console.log(`Socket with ID ${socket.id} is connected`);
    //   }
    //   //when user starts chating they where register to chat section
    //   socket.on("register", (userId) => {
    //     users.set(socket.id, userId);
    //     console.log(
    //       `user ${userId} is connected with socketId ${socket.id} and `
    //     );
    //     console.log("success ");
    //   });

    //   socket.on("checkOnline", (userId: string) => {
    //     if (userId && [...users.values()].includes(userId)) {
    //       socket.emit("userOnline", { userId, online: true });
    //       console.log("useronline");
    //     } else {
    //       socket.emit("userOnline", { userId, online: false });
    //     }
    //   });

    //   //join them to the room

    //   socket.on("join_room", (roomId: string, userId: string) => {
    //     if (roomId) {
    //       socket.join(roomId);
    //       console.log(`User ${userId} joined room ${roomId}`);
    //       socket.to(roomId).emit("room_joined", { userId, roomId });
    //     } else {
    //       console.log("User not connected to room online");
    //     }
    //   });

    //   socket.on(`sendMessage`, async(data: Imessage) => {
    //     const {
    //       chatId,
    //       senderId,
    //       receiverId,
    //       senderType,
    //       mediaUrl,
    //       messageType,
    //       content,
    //     } = data;
    //     if (
    //       !chatId ||
    //       !senderId ||
    //       !receiverId ||
    //       !senderType ||
    //       !messageType ||
    //       !content ||
    //       !mediaUrl
    //     ) {
    //       socket
    //       .to(String(chatId))
    //       .emit("receiveMessage", {
    //         message: "credential not received",
    //         result: null,
    //       });
    //     }
    //     console.log(`send message form
    //       ${senderId} to ${receiverId}`);

    //       let mentorId,menteeId;
    //       if(senderType=="mentee"){
    //             menteeId=senderId
    //             mentorId = receiverId

    //           }else{
    //             menteeId = receiverId
    //             mentorId  = senderId
    //         }
    //         const chatExist = await chatRepository.find_One({menteeId,mentorId,});
    //         if(!chatExist){
    //             // socket
    //         // .to(String(chatId))
    //         // .emit("receiveMessage", {
    //         //   message: "credential not received",
    //         //   result: null,
    //         // });
    //         // await chatRepository.createDocument({
    //           //     menteeId,
    //           //     mentorId,
    //           // })
    //         }

    //       });

    //           // Emit a connection event to the client
    //           socket.on("disconnect", () => {
    //     console.log(`Chat user disconnected: ${socket.id}`);
    //   });
    // });
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
