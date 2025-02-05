import express ,{Application} from "express";
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';dotenv.config();

import {fileLogger } from "./Config/logger";

const app:Application = express();

import auth_Router from "./Routes/authRoute";
import admin_Router from "./Routes/adminRoute";
import mentee_Router from "./Routes/menteeRoute";
import mentor_Router from "./Routes/mentorRoute";
import {connectDb} from "./Config/dataBase"
import { corsOptions } from "./Middleware/index_middleware"; 
import passport from "./Config/googleAuth";


connectDb() 
//using middlewares
app.use(cors(corsOptions));
app.use(cookieParser());

app.use((req, res, next) => {
    if (req.originalUrl === '/mentee/webhook') {
        console.log('ith u raw aane ,setaane')
      next(); // Do nothing with the body because I need it in a raw state.
    } else {
      express.json()(req, res, next);
    }
  });
// app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env?.SESSION_SECRET as string,
    resave:false,
    saveUninitialized:false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'))
app.use(fileLogger);// for log to the file 

// Routes
app.use('/auth',auth_Router);
app.use('/admin',admin_Router)
app.use('/mentee',mentee_Router);
app.use('/mentor',mentor_Router);
// app.use(errorLogger)



app.listen(process.env.PORT, () => {
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
