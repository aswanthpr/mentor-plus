import { Application } from "express";
import { Server } from "socket.io";
import { SocketManager } from "./Socket/socket";
declare const app: Application;
export declare const io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const socketManager: SocketManager;
export default app;
//# sourceMappingURL=index.d.ts.map