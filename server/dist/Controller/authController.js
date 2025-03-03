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
    menteeSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._AuthService.mentee_Signup(req.body);
                yield this._OtpService.sentOtptoMail(req.body.email);
                res.status(200).json({
                    success: true,
                    message: "OTP successfully sent to mail",
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while mentee Signup ${error instanceof Error ? error.message : error}`);
            }
        });
    }
    //get signup otp and email
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, type } = req.body;
                const result = yield this._OtpService.verifyOtp(email, otp, type);
                console.log(result, "this is otp result");
                if (result && result.success) {
                    res.status(200).json({
                        success: true,
                        message: "OTP verified successfully",
                    });
                }
                else {
                    res
                        .status(400)
                        .json({ success: false, message: "Invalid OTP or email" });
                }
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`Error while receving Otp${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //for singup otpverify resend otp
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                console.log(email, "this is from resend otp");
                yield this._OtpService.sentOtptoMail(email);
                res.status(200).json({
                    success: true,
                    message: "OTP successfully sent to mail",
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while resend otp ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    mainLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "this is from getMain login");
                const { email, password } = req.body;
                const result = yield this._AuthService.mainLogin(email, password);
                if (!result) {
                    res
                        .status(400)
                        .json({ success: false, message: "user not found. Please Singup" });
                    return;
                }
                if (result.success) {
                    res
                        .status(200)
                        .cookie("refreshToken", `${result === null || result === void 0 ? void 0 : result.refreshToken}`, {
                        httpOnly: true,
                        secure: false, //process.env.NODE_ENV === 'production',
                        sameSite: "lax",
                        maxAge: 14 * 24 * 60 * 60 * 1000,
                    })
                        .json({
                        success: result === null || result === void 0 ? void 0 : result.success,
                        message: result === null || result === void 0 ? void 0 : result.message,
                        accessToken: result === null || result === void 0 ? void 0 : result.accessToken,
                    });
                    return;
                }
                else {
                    res
                        .status(401)
                        .json({ success: result.success, message: result.message });
                    return;
                }
            }
            catch (error) {
                console.error(`Login error: ${error instanceof Error ? error.message : String(error)}`);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while Login in getMainLogin ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._AuthService.forgotPassword(req.body.email);
                if ((result === null || result === void 0 ? void 0 : result.success) == false) {
                    res.status(400).json(result);
                    return;
                }
                res.status(200).json(result);
            }
            catch (error) {
                console.error(`Login error: ${error instanceof Error ? error.message : String(error)}`);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while forgetpass in getforgetPassword ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    forgot_PasswordChange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                console.log(data, "this is the datat");
                const result = yield this._AuthService.forgot_PasswordChange(data.email, data.password);
                if ((result === null || result === void 0 ? void 0 : result.success) && (result === null || result === void 0 ? void 0 : result.message)) {
                    res
                        .status(200)
                        .json({ success: true, message: "password changed successfully" });
                }
                if ((result === null || result === void 0 ? void 0 : result.message) === "credencial is missing") {
                    res.status(400).json({ success: false, message: result.message });
                    return;
                }
                else if ((result === null || result === void 0 ? void 0 : result.message) === "user not exist.Please signup") {
                    res.status(404).json({ success: false, message: result.message });
                    return;
                }
            }
            catch (error) {
                console.error(`Login error: ${error instanceof Error ? error.message : String(error)}`);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`Error while handling forgot password request: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //admin Login
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                console.log(email, password, "thsi is the email and password");
                const result = yield this._AuthService.adminLogin(email, password);
                if (!result) {
                    res
                        .status(400)
                        .json({ success: false, message: "user not found. Please Singup" });
                    return;
                }
                if (result.success) {
                    res
                        .status(200)
                        .cookie("adminToken", result === null || result === void 0 ? void 0 : result.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 15 * 24 * 60 * 60 * 1000,
                        path: "/",
                    })
                        .json(result);
                    return;
                }
                else {
                    res.status(401).json(result);
                    return;
                }
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while admin Login${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //---------------------------------------------------------------------------
    mentorFields(req, res) {
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
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while getting mentorRoles${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    mentorApply(req, res) {
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
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while mentor application ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //metnor login;
    mentorLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield this._AuthService.mentorLogin((_a = req.body) === null || _a === void 0 ? void 0 : _a.email, (_b = req.body) === null || _b === void 0 ? void 0 : _b.password);
                res
                    .status(response.status)
                    .cookie("mentorToken", response.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 15 * 24 * 60 * 60 * 1000,
                    path: "/",
                })
                    .json({
                    success: response.success,
                    message: response.message,
                    accessToken: response.accessToken,
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while mentor signup ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //forget password for mentor
    mentorForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._AuthService.mentorForgotPassword(req.body.email);
                if ((result === null || result === void 0 ? void 0 : result.success) == false) {
                    res.status(400).json(result);
                    return;
                }
                res.status(200).json(result);
            }
            catch (error) {
                console.error(`Login error: ${error instanceof Error ? error.message : String(error)}`);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while forgetpass in getforgetPassword ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    mentorForgot_PasswordChange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                console.log(data, "this is the datat");
                const result = yield this._AuthService.mentorForgot_PasswordChange(data.email, data.password);
                if ((result === null || result === void 0 ? void 0 : result.success) && (result === null || result === void 0 ? void 0 : result.message)) {
                    res
                        .status(200)
                        .json({ success: true, message: "password changed successfully" });
                }
                if ((result === null || result === void 0 ? void 0 : result.message) === "credencial is missing") {
                    res.status(400).json({ success: false, message: result.message });
                    return;
                }
                else if ((result === null || result === void 0 ? void 0 : result.message) === "user not exist.Please signup") {
                    res.status(404).json({ success: false, message: result.message });
                    return;
                }
            }
            catch (error) {
                console.error(`Login error: ${error instanceof Error ? error.message : String(error)}`);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`Error while handling metnor forgot password request: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken, refreshToken } = yield this._AuthService.googleAuth(req.user);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.redirect(`${process.env.CLIENT_ORIGIN_URL}/mentee/google/success?token=${accessToken}`);
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: `Error while Google auth: ${error instanceof Error ? error.message : String(error)}`,
                });
            }
        });
    }
}
exports.authController = authController;
