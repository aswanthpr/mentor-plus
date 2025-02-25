import { Server } from "socket.io";
import { Inotification } from "../Model/notificationModel";
export declare class SocketManager {
    private io;
    constructor(io: Server);
    initialize(): void;
    private setupNotifications;
    sendNotification: (userId: string, message: Inotification) => void;
    private setupChat;
}
//# sourceMappingURL=socket.d.ts.map