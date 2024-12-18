import express,{Router} from 'express';
import { AuthController } from '../CONTROLLER/AuthController';
import { AuthService } from '../SERVICE/AuthService';
import  AuthRepository  from '../REPOSITORY/AuthRepo';
import OtpService from '../SERVICE/OtpService';
import OtpRepo from '../REPOSITORY/OtpRepo';


const __authService = new AuthService(AuthRepository)
const __otpService = new OtpService(OtpRepo)
const __authController = new AuthController(__authService,__otpService);

const auth_Router :Router = express.Router()

auth_Router.post('/signup',__authController.menteeSignup.bind(__authController));
auth_Router.post('/verify-otp',__authController.getVerifyOtp.bind(__authController));
auth_Router.post('/resend-otp',__authController.getResendOtp.bind(__authController));
auth_Router.post('/login',__authController.getMainLogin.bind(__authController))
export default auth_Router