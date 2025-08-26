import express, { Application } from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
 
//custorm imports
import { fileLogger } from "./Utils/logger.util";
import { connectDb } from "./Config/dataBase.config";
import {
  // limiter,
  compress,
  corsConfig,
  urlEncoding,
  corsOptions,
  helmetConfig,
  sessionConfig,
  jsonParseOrRaw,
  cacheControl,
} from "./Middleware/index_middleware";
import passport from "./Config/googleAuth.config";
import { SocketManager } from "./Socket/socket";

//routes import
import auth_Router from "./Routes/authRoute";
import admin_Router from "./Routes/adminRoute";
import mentee_Router from "./Routes/menteeRoute";
import mentor_Router from "./Routes/mentorRoute";
 
// Initializing the application and server
const app: Application = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: corsConfig,
});
// connecting with database
connectDb();

//initialize the socket
export const socketManager = new SocketManager(io);
socketManager.initialize();

//using middlewares
if (process.env.NODE_ENV === "production") {
  // In production, trust the first proxy.
  app.set("trust proxy", 1);
}
app.use(cacheControl)
app.use(helmetConfig); // set security headers
// app.use(limiter); //express rate limit
app.use(compress); //response compresser for performance
app.use(cors(corsOptions)); //to bypass sop
app.use(cookieParser()); // to parse cookie data

app.use(jsonParseOrRaw); //conditionally parse body data to json or  remain raw
app.use(urlEncoding); //encode response data
app.use(sessionConfig); // sesion configuration
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan("dev"));
app.use(fileLogger);

// Routes
app.use("/auth", auth_Router);
app.use("/admin", admin_Router);
app.use("/mentee", mentee_Router);
app.use("/mentor", mentor_Router);
// app.use(errorLogger)

//server listening

server.listen(process.env.PORT, () => {
  console.log(`


\x1b[1;35m
 ███▄ ▄███▓▓█████  ███▄    █ ▄▄▄█████▓ ▒█████   ██▀███      ██▓███   ██▓     █    ██   ██████ 
▓██▒▀█▀ ██▒▓█   ▀  ██ ▀█   █ ▓  ██▒ ▓▒▒██▒  ██▒▓██ ▒ ██▒   ▓██░  ██▒▓██▒     ██  ▓██▒▒██    ▒ 
▓██    ▓██░▒███   ▓██  ▀█ ██▒▒ ▓██░ ▒░▒██░  ██▒▓██ ░▄█ ▒   ▓██░ ██▓▒▒██░    ▓██  ▒██░░ ▓██▄   
▒██    ▒██ ▒▓█  ▄ ▓██▒  ▐▌██▒░ ▓██▓ ░ ▒██   ██░▒██▀▀█▄     ▒██▄█▓▒ ▒▒██░    ▓▓█  ░██░  ▒   ██▒
▒██▒   ░██▒░▒████▒▒██░   ▓██░  ▒██▒ ░ ░ ████▓▒░░██▓ ▒██▒   ▒██▒ ░  ░░██████▒▒▒█████▓ ▒██████▒▒
░ ▒░   ░  ░░░ ▒░ ░░ ▒░   ▒ ▒   ▒ ░░   ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░   ▒▓▒░ ░  ░░ ▒░▓  ░░▒▓▒ ▒ ▒ ▒ ▒▓▒ ▒ ░
░  ░      ░ ░ ░  ░░ ░░   ░ ▒░    ░      ░ ▒ ▒░   ░▒ ░ ▒░   ░▒ ░     ░ ░ ▒  ░░░▒░ ░ ░ ░ ░▒  ░ ░
░      ░      ░      ░   ░ ░   ░      ░ ░ ░ ▒    ░░   ░    ░░         ░ ░    ░░░ ░ ░ ░  ░  ░  
       ░      ░  ░         ░              ░ ░     ░                     ░  ░   ░           ░  
\x1b[0
\x1b[1;32m******************************\x1b[0m
\x1b[1;33m🌟 Server is up! 🌟\x1b[0m
\x1b[1;34mServer running at http://localhost:${process.env.PORT}\x1b[0m
\x1b[1;36mCurrent Time: ${new Date().toLocaleString()}\x1b[0m
\x1b[1;32m******************************\x1b[0m`);
}).on('error',(err:unknown)=>{
  console.error(err instanceof Error? err.message:String(err))
});

export default app;
