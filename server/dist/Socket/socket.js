"use strict";
// webrtc here using the socket io for signaling;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const messageRepository_1 = __importDefault(require("../Repository/messageRepository"));
const mongoose_1 = __importDefault(require("mongoose"));
const chatRepository_1 = __importDefault(require("../Repository/chatRepository"));
const chatSchema_1 = __importDefault(require("../Model/chatSchema"));
const chatMap = new Map();
class SocketManager {
    constructor(io) {
        // for emitting new notification 
        this.sendNotification = (userId, message) => {
            this.io
                .of("/notifications")
                .to(userId)
                .emit("receive-notification", message);
        };
        this.io = io;
    }
    initialize() {
        this.setupChat();
        this.setupNotifications();
        // this.setupWebRTC();
    }
    //Notification============================================================
    setupNotifications() {
        //notificatin namespace set
        const notificationNamespace = this.io.of("/notifications");
        notificationNamespace.on("connection", (socket) => {
            console.log(`Notification user connected: ${socket.id}`);
            //join to specific users notification room
            socket.on("join-room", (userId) => {
                socket.join(userId);
                console.log(`User ${userId} joined their notification room`);
            });
            //disconnect user
            socket.on("disconnect", () => {
                console.log(`Notification user disconnected: ${socket.id}`);
            });
        });
    }
    //chat=====================================================================
    setupChat() {
        //setting chat name space
        const chatNsp = this.io.of("/chat");
        chatNsp.on("connection", (socket) => {
            const userId = socket.handshake.auth.token;
            if (!userId) {
                console.error("User is not authenticated");
                socket.disconnect();
                return;
            }
            //verify connection and inserting online user to the map
            if (socket.connected) {
                console.log(`ChatSocket with ID ${socket.id} is connected`);
                chatMap.set(userId, socket === null || socket === void 0 ? void 0 : socket.id);
            }
            // user broadcast online status
            socket.broadcast.emit("userOnline", [...chatMap.keys()]);
            //join the user to a specific room
            socket.on("join-room", (data) => __awaiter(this, void 0, void 0, function* () {
                if (!(data === null || data === void 0 ? void 0 : data.roomId))
                    return;
                console.log(`user joined in the room`, data === null || data === void 0 ? void 0 : data.roomId);
                socket.join(data === null || data === void 0 ? void 0 : data.roomId);
                try {
                    //fetch all specific roomid message 
                    const result = yield messageRepository_1.default.getMessage(new mongoose_1.default.Types.ObjectId(data === null || data === void 0 ? void 0 : data.roomId));
                    //send all  messages to the chatnamespace's specific  users roomId 
                    chatNsp
                        .to(data === null || data === void 0 ? void 0 : data.roomId)
                        .emit("all-message", { result, roomId: data === null || data === void 0 ? void 0 : data.roomId });
                }
                catch (error) {
                    throw new Error(`${error instanceof Error ? error.message : String(error)}`);
                }
            }));
            //geting new message
            socket.on("new-message", (_a) => __awaiter(this, [_a], void 0, function* ({ roomId, message }) {
                var _b;
                console.log(`Message to Room ${roomId}: ${message}`, message === null || message === void 0 ? void 0 : message.senderId, message === null || message === void 0 ? void 0 : message.chatId, message === null || message === void 0 ? void 0 : message.receiverId, message === null || message === void 0 ? void 0 : message.content, message === null || message === void 0 ? void 0 : message.senderType, message === null || message === void 0 ? void 0 : message.messageType);
                try {
                    if (!roomId) {
                        console.log("no room");
                        throw new Error("Invalid or missing roomId.");
                    }
                    if (!message ||
                        !(message === null || message === void 0 ? void 0 : message.senderId) ||
                        !(message === null || message === void 0 ? void 0 : message.chatId) ||
                        !(message === null || message === void 0 ? void 0 : message.receiverId) ||
                        !((_b = message === null || message === void 0 ? void 0 : message.content) === null || _b === void 0 ? void 0 : _b.trim()) ||
                        !(message === null || message === void 0 ? void 0 : message.senderType) ||
                        !(message === null || message === void 0 ? void 0 : message.messageType)) {
                        throw new Error("Message cannot be empty.");
                    }
                    //create new message
                    const result = yield messageRepository_1.default.createMessage(message);
                    if (!result) {
                        chatNsp
                            .to(roomId)
                            .emit("errorMessage", { error: "message not created " });
                    }
                    //send back the  new  message 
                    chatNsp.to(roomId).emit("receive-message", { result, roomId });
                    //decode the %$like code from the file name 
                    const messageContent = (message === null || message === void 0 ? void 0 : message.messageType) == "text"
                        ? message === null || message === void 0 ? void 0 : message.content
                        : decodeURIComponent(message === null || message === void 0 ? void 0 : message.content.split("/").pop());
                    //setting the last message
                    yield chatRepository_1.default.find_By_Id_And_Update(chatSchema_1.default, message === null || message === void 0 ? void 0 : message.chatId, { $set: { lastMessage: String(messageContent) } });
                }
                catch (error) {
                    console.error("Error in sendMessageToRoom:", error instanceof Error ? error.message : String(error));
                    // ✅ Send error message to the client
                    chatNsp.emit("errorMessage", { error: error });
                }
            }));
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
exports.SocketManager = SocketManager;
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
