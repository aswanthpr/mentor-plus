"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../CONTROLLER/AuthController");
const AuthService_1 = require("../SERVICE/AuthService");
const AuthRepo_1 = __importDefault(require("../REPOSITORY/AuthRepo"));
const OtpService_1 = __importDefault(require("../SERVICE/OtpService"));
const OtpRepo_1 = __importDefault(require("../REPOSITORY/OtpRepo"));
const CategoryRepository_1 = __importDefault(require("../REPOSITORY/CategoryRepository"));
const multer_util_1 = __importDefault(require("../UTILS/upload/multer.util"));
const __otpService = new OtpService_1.default(OtpRepo_1.default);
const __authService = new AuthService_1.AuthService(AuthRepo_1.default, __otpService, CategoryRepository_1.default);
const __authController = new AuthController_1.AuthController(__authService, __otpService);
const auth_Router = express_1.default.Router();
//mentee auth
auth_Router.post('/signup', __authController.menteeSignup.bind(__authController));
auth_Router.post('/verify-otp', __authController.getVerifyOtp.bind(__authController));
auth_Router.post('/resend-otp', __authController.getResendOtp.bind(__authController));
auth_Router.post('/login', __authController.getMainLogin.bind(__authController));
auth_Router.post('/refresh-token', __authController.getAccessToken.bind(__authController));
auth_Router.post('/forgot_password', __authController.getForgotPassword.bind(__authController));
auth_Router.put('/change_password', __authController.getForgot_PasswordChange.bind(__authController));
// metor
auth_Router.get(`/apply_as_mentor`, __authController.getMentorFields.bind(__authController));
auth_Router.post(`/apply_as_mentor`, multer_util_1.default.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: "skills", maxCount: 8 }
]), __authController.getMentorApply.bind(__authController));
//admin auth
auth_Router.post('/admin/login', __authController.getAdminLogin.bind(__authController));
exports.default = auth_Router;
