import express,{Router} from 'express';
import { AuthController } from '../CONTROLLER/AuthController';
import { AuthService } from '../SERVICE/AuthService';
import  AuthRepository  from '../REPOSITORY/AuthRepo';
import OtpService from '../SERVICE/OtpService';
import OtpRepo from '../REPOSITORY/OtpRepo';


const __otpService = new OtpService(OtpRepo)
const __authService = new AuthService(AuthRepository,__otpService)
const __authController = new AuthController(__authService,__otpService);

const auth_Router :Router = express.Router()

//mentee auth
auth_Router.post('/signup',__authController.menteeSignup.bind(__authController));
auth_Router.post('/verify-otp',__authController.getVerifyOtp.bind(__authController));
auth_Router.post('/resend-otp',__authController.getResendOtp.bind(__authController));
auth_Router.post('/login',__authController.getMainLogin.bind(__authController));
auth_Router.post('/refresh-token',__authController.getAccessToken.bind(__authController))
auth_Router.post('/forgot_password',__authController.getForgotPassword.bind(__authController));
auth_Router.put('/change_password',__authController.getForgot_PasswordChange.bind(__authController))


//admin auth
auth_Router.post('/admin/login',__authController.getAdminLogin.bind(__authController))
export default auth_Router