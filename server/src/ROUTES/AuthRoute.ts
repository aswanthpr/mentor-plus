import express,{Router} from 'express';
import { AuthController } from '../CONTROLLER/AuthController';
import { AuthService } from '../SERVICE/AuthService';
import  AuthRepository  from '../REPOSITORY/AuthRepo';


const authService = new AuthService(AuthRepository)
const authController = new AuthController(authService);

const auth_Router :Router = express.Router()

auth_Router.post('/signup',authController.menteeSignup.bind(authController))

export default auth_Router