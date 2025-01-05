import express,{Router,Request,Response} from 'express';
import { AuthController } from '../CONTROLLER/AuthController';
import { AuthService } from '../SERVICE/AuthService';
import OtpService from '../SERVICE/OtpService';
import OtpRepo from '../REPOSITORY/OtpRepo';
import CategoryRepository from '../REPOSITORY/CategoryRepository';
import upload from '../CONFIG/multer.util';
import MentorRepository from '../REPOSITORY/MentorRepository';
import passport from 'passport';
import MenteeRepository from '../REPOSITORY/MenteeRepository';


const __otpService = new OtpService(OtpRepo,MenteeRepository)
const __authService = new AuthService(__otpService,CategoryRepository,MentorRepository,MenteeRepository)
const __authController = new AuthController(__authService,__otpService);

const auth_Router :Router = express.Router()

//mentee auth
auth_Router.post('/signup',__authController.menteeSignup.bind(__authController));
auth_Router.post('/verify-otp',__authController.getVerifyOtp.bind(__authController));
auth_Router.post('/resend-otp',__authController.getResendOtp.bind(__authController));
auth_Router.post('/login/mentee',__authController.getMainLogin.bind(__authController));

auth_Router.post('/forgot_password/mentee',__authController.getForgotPassword.bind(__authController));
auth_Router.put('/change_password/mentee',__authController.getForgot_PasswordChange.bind(__authController))

// metor
auth_Router.get(`/apply_as_mentor`,__authController.getMentorFields.bind(__authController));
auth_Router.post(`/apply_as_mentor`,upload.fields(
        [
            {name:'profileImage',maxCount:1},
            {name:'resume',maxCount:1},
            {name:"skills",maxCount:8}
        ]
    ),__authController.getMentorApply.bind(__authController));
auth_Router.post(`/login/mentor`,__authController.getMentorLogin.bind(__authController));
auth_Router.post('/forgot_password/mentor',__authController.getMentorForgotPassword.bind(__authController));
auth_Router.put('/change_password/mentor',__authController.getMentorForgot_PasswordChange.bind(__authController))

//admin auth
auth_Router.post('/login/admin',__authController.getAdminLogin.bind(__authController));

//google
auth_Router.get(`/google`,passport.authenticate('google',{scope:['email','profile']}));


auth_Router.get(`/google/callback`,passport.authenticate('google',{
    successRedirect:'/auth/google/success',
    failureRedirect:'http://localhost:5173/auth/login/mentee',
}));

auth_Router.get(`/google/success`,__authController.getGoogleAuth.bind(__authController));

export default auth_Router


