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
const slotScheduleRepository_1 = __importDefault(require("../Repository/slotScheduleRepository"));
const _slotScheduleRepo = slotScheduleRepository_1.default;
const chatMap = new Map();
const rooms = new Map(); //webrtc
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
        this.setupWebRTC();
    }
    //Notification============================================================
    setupNotifications() {
        //notificatin namespace set
        const notificationNamespace = this.io.of("/notifications");
        notificationNamespace.on("connection", (socket) => {
            //join to specific users notification room
            socket.on("join-room", (userId) => {
                socket.join(userId);
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
            }
            chatMap.set(userId, socket === null || socket === void 0 ? void 0 : socket.id);
            // user emit online status
            chatNsp.emit("userOnline", [...chatMap.keys()]);
            //join the user to a specific room
            socket.on("join-room", (data) => __awaiter(this, void 0, void 0, function* () {
                if (!(data === null || data === void 0 ? void 0 : data.roomId))
                    return;
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
                try {
                    if (!roomId) {
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
                        : message === null || message === void 0 ? void 0 : message.messageType;
                    //setting the last message
                    yield chatRepository_1.default.find_By_Id_And_Update(chatSchema_1.default, message === null || message === void 0 ? void 0 : message.chatId, { $set: { lastMessage: String(messageContent) } });
                }
                catch (error) {
                    console.error("Error in sendMessageToRoom:", error instanceof Error ? error.message : String(error));
                    // Send error message to the client
                    chatNsp.emit("errorMessage", { error: error });
                }
            }));
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
    setupWebRTC() {
        const webrtcNamespace = this.io.of("/webrtc");
        webrtcNamespace.on("connection", (socket) => {
            console.log(`WebRTC user connected: ${socket.id}`);
            socket.on("join-call", (_a) => __awaiter(this, [_a], void 0, function* ({ roomId, sessionId, userId }) {
                const result = yield _slotScheduleRepo.validateSessionJoin(new mongoose_1.default.Types.ObjectId(sessionId), roomId, new mongoose_1.default.Types.ObjectId(userId));
                if (!result) {
                    socket.emit("join-fail", "Invalid session or user");
                    socket.disconnect();
                    return;
                }
                socket.join(roomId);
                console.log(`User ${socket.id} joined room: ${roomId}`);
                if (!rooms.has(roomId)) {
                    rooms.set(roomId, new Set());
                }
                rooms.get(roomId).add(socket.id);
                socket.to(roomId).emit("user-joined", socket.id);
            }));
            socket.on("offer", (offer, roomId) => {
                console.log(`Offer received in room ${roomId}`);
                socket.to(roomId).emit("offer", offer, socket.id);
            });
            socket.on("answer", (answer, roomId) => {
                console.log(`Answer received in room ${roomId}`);
                socket.to(roomId).emit("answer", answer);
            });
            socket.on("ice-candidate", (candidate, roomId) => {
                console.log(`ICE Candidate received in room ${roomId}`);
                socket.to(roomId).emit("ice-candidate", candidate);
            });
            socket.on("video:toggle", ({ isMuted, roomId }) => {
                console.log(`Video toggle received from ${socket.id} in room ${roomId}`);
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
exports.SocketManager = SocketManager;
