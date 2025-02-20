import { DefaultEventsMap, Server } from "socket.io";
import http from "http";
import { Inotification } from "src/Model/notificationModel";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export const initilizeSocket  = (server:http.Server) =>{
    io = new Server(server,{
        cors:{
            origin:process.env.CLIENT_ORIGIN_URL,
            methods:["GET","POST"],
            credentials:true
        },

    })

    io.on("connection",(socket)=>{
        console.log('Connected socket ID:',socket.id)

        socket.on("notification",(data)=>{
            // socket.join(userId)//user join their personal notification room
            console.log(data,'message received')
        io.emit('receive_notification',data)
        })
        
        socket.on('disconnect',()=>{
            console.log('user disconnected');
        });

    })

return io;

};

export const getSocket = (): Server => {
  if (!io) {
      console.error('Socket.IO has not been initialized. Please check the server configuration.');
      throw new Error('Socket.IO not initialized');
  }
  return io;
};


export const sendNotification = (userId: string, notification:Inotification) => {
  const socket = getSocket();
  // Emit notification to a specific user based on their userId
  socket.to(userId).emit("notificationReceived", notification);
};
