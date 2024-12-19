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
exports.AuthController = void 0;
class AuthController {
    constructor(_AuthService, _OtpService) {
        this._AuthService = _AuthService;
        this._OtpService = _OtpService;
    }
    //mentee sinup controll
    menteeSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "signup req body");
                const result = yield this._AuthService.mentee_Signup(req.body);
                if (!result.success) {
                    res.status(409).json({ success: false, message: result.message });
                }
                yield this._OtpService.sentOtptoMail(req.body.email);
                if (result) {
                    res.status(200).json({
                        success: true,
                        message: "OTP successfully sent to mail",
                    });
                }
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
    getVerifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const { email, otp } = req.body;
                if (!email || !otp) {
                    res
                        .status(400)
                        .json({ success: false, message: "credential is missing" });
                }
                const result = yield this._OtpService.BLVerifyOtp(email, otp);
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
    getResendOtp(req, res) {
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
    getMainLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "this is from getMain login");
                const { email, password } = req.body;
                if (!email || !password) {
                    res
                        .status(400)
                        .json({ success: false, message: "credential is  missing" });
                    return;
                }
                const result = yield this._AuthService.BLMainLogin(email, password);
                const refresh_Token = result === null || result === void 0 ? void 0 : result.refreshToken;
                const accessToken = result === null || result === void 0 ? void 0 : result.accessToken;
                if (result.success) {
                    res.cookie("token", refresh_Token, {
                        httpOnly: true,
                        secure: false, //in development fasle process.env.NODE_ENV === 'production'
                        sameSite: "none",
                        maxAge: 15 * 24 * 60 * 60 * 1000,
                    });
                    delete result.refreshToken;
                    res.status(200).json(result);
                    return;
                }
                else {
                    res.status(401).json(result);
                    return;
                }
            }
            catch (error) {
                console.error(`Login error: ${error instanceof Error ? error.message : String(error)}`);
                // res
                //   .status(500)
                //   .json({ success: false, message: "Internal server error" });
                throw new Error(`error while Login in getMainLogin ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    getForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, user } = req.body;
                console.log(email, user, "thsi is from forgot password");
                const result = yield this._AuthService.BLforgotPassword(email, user);
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
    getForgot_PasswordChange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                console.log(data, 'this is the datat');
                const result = yield this._AuthService.BLforgot_PasswordChange(data.email, data.password);
                if ((result === null || result === void 0 ? void 0 : result.success) && (result === null || result === void 0 ? void 0 : result.message)) {
                    res.status(200).json({ success: true, message: 'password changed successfully' });
                }
                if ((result === null || result === void 0 ? void 0 : result.message) === 'credencial is missing') {
                    res.status(400).json({ success: false, message: result.message });
                    return;
                }
                else if ((result === null || result === void 0 ? void 0 : result.message) === 'user not exist.Please signup') {
                    res.status(404).json({ success: false, message: result.message });
                    return;
                }
            }
            catch (error) {
                console.error(`Login error: ${error instanceof Error ? error.message : String(error)}`);
                res.status(500).json({ success: false, message: 'Internal server error' });
                throw new Error(`Error while handling forgot password request: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //for creating new access token
    getAccessToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.signedCookies.token;
                console.log(refreshToken, "thsi isthe refresh token from cookies", req.cookies, req.signedCookies);
                if (!refreshToken) {
                    res
                        .status(403)
                        .json({ success: false, message: "No refresh token provided" });
                    return;
                }
                const result = yield this._AuthService.BLAccessToken(refreshToken);
                const refresh_Token = result === null || result === void 0 ? void 0 : result.refreshToken;
                if (result.success) {
                    res.cookie("refreshToken", refresh_Token, {
                        signed: true,
                        httpOnly: true,
                        secure: false, //process.env.NODE_ENV === 'develpment',//in development fasle
                        sameSite: "none",
                        maxAge: 15 * 24 * 60 * 60 * 1000,
                    });
                    delete result.refreshToken;
                    res.status(200).json(result);
                }
                else {
                    res.status(401).json(result);
                }
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while geting refreshToken${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.AuthController = AuthController;
