import { DefaultEventsMap, Server } from "socket.io";
import http from "http";
import { Inotification } from "src/Model/notificationModel";
export declare const initilizeSocket: (server: http.Server) => Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
export declare const getSocket: () => Server;
export declare const sendNotification: (userId: string, notification: Inotification) => void;
//# sourceMappingURL=notificationSocket.d.ts.map