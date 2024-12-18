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
                console.error("error during mentee registration");
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
                        .json({ success: false, message: "Email or OTP is missing" });
                }
                const result = yield this._OtpService.BLVerifyOtp(email, otp);
                if (result && result.success) {
                    res.status(200).json({
                        success: true,
                        message: "OTP verified successfully. Signup complete!",
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
                console.log(req.body, 'this is from getMain login');
                const { formData } = req.body;
                if (!formData) {
                    res
                        .status(400)
                        .json({ success: false, message: "Email and  password missing" });
                }
                const result = yield this._AuthService.BLMainLogin(formData);
                if (result.success) {
                    res.status(200).json(result);
                }
                else {
                    res.status(401).json(result);
                }
            }
            catch (error) {
                throw new Error(`error while Login in getMainLogin ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.AuthController = AuthController;
