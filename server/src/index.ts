import express, { Application } from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import dotenv from "dotenv";dotenv.config();
import helmet from "helmet";

//custorm imports 
import { fileLogger } from "./Config/logger";
import { connectDb } from "./Config/dataBase";
import { corsOptions } from "./Middleware/index_middleware";
import passport from "./Config/googleAuth"; 
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
  cors: {
    origin: process.env.CLIENT_ORIGIN_URL as string,
    methods: ["GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",],
    allowedHeaders: ["Content-Type"], 
    credentials: true,
  },
});
// connected with database
connectDb();

//initialize the socket 
export const socketManager = new SocketManager(io);
socketManager.initialize();

//using middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet())
app.use((req, res, next) => {
  if (req.originalUrl === "/mentee/webhook") {
 
    next(); // Do nothing with the body because  need it in a raw state.
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env?.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);
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
});
 
export default app;
  