import express,{Router} from 'express';
import { authController } from '../Controller/implementation/authController';
import { authService } from '../Service/implementation/authService';
import otpService from '../Service/implementation/otpService';
import otpRepo from '../Repository/implementation/otpRepo';
import categoryRepository from '../Repository/implementation/categoryRepository';
import upload from '../Middleware/multer.';
import mentorRepository from '../Repository/implementation/mentorRepository';
import passport from 'passport';
import menteeRepository from '../Repository/implementation/menteeRepository';
import notificationRepository from '../Repository/implementation/notificationRepository';
import { IauthController } from '../Controller/interface/iAuthController';

const __otpService = new otpService(otpRepo,menteeRepository)
const __authService = new authService(__otpService,categoryRepository,mentorRepository,menteeRepository,notificationRepository)
const __authController:IauthController = new authController(__authService,__otpService);

const auth_Router :Router = express.Router();

//mentee auth
auth_Router.post('/signup',__authController.menteeSignup.bind(__authController));
auth_Router.post('/verify-otp',__authController.verifyOtp.bind(__authController));
auth_Router.post('/resend-otp',__authController.resendOtp.bind(__authController));
auth_Router.post('/login/mentee',__authController.mainLogin.bind(__authController));

auth_Router.post('/forgot_password/mentee',__authController.forgotPassword.bind(__authController));
auth_Router.put('/change_password/mentee',__authController.forgot_PasswordChange.bind(__authController))

// mentor
auth_Router.get(`/apply_as_mentor`,__authController.mentorFields.bind(__authController));
auth_Router.post(`/apply_as_mentor`,upload.fields(
        [
            {name:'profileImage',maxCount:1},
            {name:'resume',maxCount:1},
            {name:"skills",maxCount:8}
        ]
    ),__authController.mentorApply.bind(__authController));
auth_Router.post(`/login/mentor`,__authController.mentorLogin.bind(__authController));
auth_Router.post('/forgot_password/mentor',__authController.mentorForgotPassword.bind(__authController));
auth_Router.put('/change_password/mentor',__authController.mentorForgot_PasswordChange.bind(__authController))
 
//admin auth
auth_Router.post('/login/admin',__authController.adminLogin.bind(__authController));

//google
auth_Router.get(`/google`,passport.authenticate('google',{scope:['email','profile']}));


auth_Router.get(`/google/callback`,passport.authenticate('google',{
    successRedirect:'/auth/google/success',
    failureRedirect:`${process.env.CLIENT_ORIGIN_URL}/mentee/google/failure`,
}));

auth_Router.get(`/google/success`,__authController.googleAuth.bind(__authController));


export default auth_Router


