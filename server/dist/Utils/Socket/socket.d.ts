import { Server } from "socket.io";
import http from 'node:http';
import { Inotification } from "src/Model/notificationModel";
export declare const initializeSocket: (server: http.Server) => void;
export declare const getIo: () => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const sendNotification: (userId: string, message: Inotification) => void;
//# sourceMappingURL=socket.d.ts.map