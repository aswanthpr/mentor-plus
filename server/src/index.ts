import express ,{Application} from "express";
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';dotenv.config();

const app:Application = express();

import auth_Router from "./ROUTES/AuthRoute";
import admin_Router from "./ROUTES/AdminRoute";
import mentee_Router from "./ROUTES/MenteeRoute";
import mentor_Router from "./ROUTES/MentorRoute";
import {connectDb} from "./CONFIG/DataBase"
import { corsOptions } from "./MIDDLEWARE/index_middleware"; 
import passport from "./CONFIG/googleAuth";



connectDb() 
//using middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env?.SESSION_SECRET as string,
    resave:false,
    saveUninitialized:false,
}));
app.use(passport.initialize());
app.use(passport.session());

 
// Routes
app.use('/auth',auth_Router);
app.use('/admin',admin_Router)
app.use('/mentee',mentee_Router);
app.use('/mentor',mentor_Router);


app.listen(process.env.PORT
    ,()=>{
    console.log('\x1b[33m%s\x1b[0m',"server listen on http://localhost:3000")
})
export default app   