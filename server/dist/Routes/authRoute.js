"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../Controller/authController");
const authService_1 = require("../Service/authService");
const otpService_1 = __importDefault(require("../Service/otpService"));
const otpRepo_1 = __importDefault(require("../Repository/otpRepo"));
const categoryRepository_1 = __importDefault(require("../Repository/categoryRepository"));
const multer_util_1 = __importDefault(require("../Config/multer.util"));
const mentorRepository_1 = __importDefault(require("../Repository/mentorRepository"));
const passport_1 = __importDefault(require("passport"));
const menteeRepository_1 = __importDefault(require("../Repository/menteeRepository"));
const notificationRepository_1 = __importDefault(require("../Repository/notificationRepository"));
const __otpService = new otpService_1.default(otpRepo_1.default, menteeRepository_1.default);
const __authService = new authService_1.authService(__otpService, categoryRepository_1.default, mentorRepository_1.default, menteeRepository_1.default, notificationRepository_1.default);
const __authController = new authController_1.authController(__authService, __otpService);
const auth_Router = express_1.default.Router();
//mentee auth
auth_Router.post('/signup', __authController.menteeSignup.bind(__authController));
auth_Router.post('/verify-otp', __authController.verifyOtp.bind(__authController));
auth_Router.post('/resend-otp', __authController.resendOtp.bind(__authController));
auth_Router.post('/login/mentee', __authController.mainLogin.bind(__authController));
auth_Router.post('/forgot_password/mentee', __authController.forgotPassword.bind(__authController));
auth_Router.put('/change_password/mentee', __authController.forgot_PasswordChange.bind(__authController));
// metor
auth_Router.get(`/apply_as_mentor`, __authController.mentorFields.bind(__authController));
auth_Router.post(`/apply_as_mentor`, multer_util_1.default.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: "skills", maxCount: 8 }
]), __authController.mentorApply.bind(__authController));
auth_Router.post(`/login/mentor`, __authController.mentorLogin.bind(__authController));
auth_Router.post('/forgot_password/mentor', __authController.mentorForgotPassword.bind(__authController));
auth_Router.put('/change_password/mentor', __authController.mentorForgot_PasswordChange.bind(__authController));
//admin auth
auth_Router.post('/login/admin', __authController.adminLogin.bind(__authController));
//google
auth_Router.get(`/google`, passport_1.default.authenticate('google', { scope: ['email', 'profile'] }));
auth_Router.get(`/google/callback`, passport_1.default.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: `${process.env.CLIENT_ORIGIN_URL}/auth/login/mentee`,
    failureMessage: true,
    successMessage: true
}));
auth_Router.get(`/google/success`, __authController.googleAuth.bind(__authController));
exports.default = auth_Router;
