import express ,{Application} from "express";
import dotenv from 'dotenv';dotenv.config();
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app:Application = express();

import auth_Router from "./ROUTES/AuthRoute";
import admin_Router from "./ROUTES/AdminRoute";
import mentee_Router from "./ROUTES/MenteeRoute";
import mentor_Router from "./ROUTES/MentorRoute";
import {connectDb} from "./CONFIG/DataBase"
import { corsOptions } from "./MIDDLEWARE/index_middleware";


connectDb() 
//using middlewares
app.use(cors(corsOptions));
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

 
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