"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
class authController {
    constructor(_AuthService, _OtpService) {
        this._AuthService = _AuthService;
        this._OtpService = _OtpService;
    }
    //mentee sinup controll
    menteeSignup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [{ status, success, message }] = yield Promise.all([
                    this._AuthService.mentee_Signup(req.body),
                    this._OtpService.sentOtptoMail(req.body.email),
                ]);
                res.status(status).json({
                    success,
                    message,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //get signup otp and email
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, type } = req.body;
                const { status, message, success } = yield this._OtpService.verifyOtp(email, otp, type);
                res.status(status).json({
                    success,
                    message,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //for singup otpverify resend otp
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const { message, status, success } = yield this._OtpService.sentOtptoMail(email);
                res.status(status).json({ message, success });
            }
            catch (error) {
                next(error);
            }
        });
    }
    mainLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { email, password } = req.body;
                const result = yield this._AuthService.mainLogin(email, password);
                res
                    .status(result === null || result === void 0 ? void 0 : result.status)
                    .cookie("refreshToken", `${(_a = result === null || result === void 0 ? void 0 : result.refreshToken) !== null && _a !== void 0 ? _a : ""}`, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "none",
                    maxAge: 14 * 24 * 60 * 60 * 1000,
                })
                    .json({
                    success: result === null || result === void 0 ? void 0 : result.success,
                    message: result === null || result === void 0 ? void 0 : result.message,
                    accessToken: result === null || result === void 0 ? void 0 : result.accessToken,
                });
                return;
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._AuthService.forgotPassword(req.body.email);
                res.status(result === null || result === void 0 ? void 0 : result.status).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgot_PasswordChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const { message, status, success } = yield this._AuthService.forgot_PasswordChange(data.email, data.password);
                res.status(status).json({ success, message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //admin Login
    adminLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { success, message, status, refreshToken, accessToken } = yield this._AuthService.adminLogin(email, password);
                res
                    .status(status)
                    .cookie("adminToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "none",
                    maxAge: 15 * 24 * 60 * 60 * 1000,
                    path: "/",
                })
                    .json({ message, success, accessToken });
                return;
            }
            catch (error) {
                next(error);
            }
        });
    }
    //---------------------------------------------------------------------------
    mentorFields(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._AuthService.mentorFields();
                res.status(result.status).json({
                    success: result.success,
                    message: result.message,
                    categories: result.categories,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    mentorApply(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, phone, jobTitle, category, linkedinUrl, githubUrl, bio, skills, } = req.body;
                const profileImage = req.files &&
                    req.files.profileImage
                    ? req.files
                        .profileImage[0]
                    : null;
                const resume = req.files &&
                    req.files.resume
                    ? req.files.resume[0]
                    : null;
                const mentorData = {
                    body: {
                        name,
                        email,
                        phone,
                        password,
                        jobTitle,
                        category,
                        linkedinUrl,
                        githubUrl,
                        bio,
                        skills,
                    },
                    files: { profileImage, resume },
                };
                const result = yield this._AuthService.mentorApply(mentorData);
                res
                    .status(result === null || result === void 0 ? void 0 : result.status)
                    .json({ success: result === null || result === void 0 ? void 0 : result.success, message: result === null || result === void 0 ? void 0 : result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //metnor login;
    mentorLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { status, success, message, accessToken, refreshToken } = yield this._AuthService.mentorLogin(email, password);
                res
                    .status(status)
                    .cookie("mentorToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "none",
                    maxAge: 15 * 24 * 60 * 60 * 1000,
                    path: "/",
                })
                    .json({
                    success,
                    message,
                    accessToken,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //forget password for mentor
    mentorForgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message, status, success } = yield this._AuthService.mentorForgotPassword(req.body.email);
                res.status(status).json({ message, success });
            }
            catch (error) {
                next(error);
            }
        });
    }
    mentorForgot_PasswordChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const { message, success, status } = yield this._AuthService.mentorForgot_PasswordChange(data.email, data.password);
                res.status(status).json({ success, message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    googleAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.user);
                const { accessToken, refreshToken } = yield this._AuthService.googleAuth(req.user);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.redirect(`${process.env.CLIENT_ORIGIN_URL}/mentee/google/success?token=${accessToken}`);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.authController = authController;
