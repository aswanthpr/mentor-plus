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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_util_1 = require("../UTILS/nodemailer.util");
const otpGen_util_1 = __importDefault(require("../UTILS/otpGen.util"));
class OtpService {
    constructor(_OtpRespository) {
        this._OtpRespository = _OtpRespository;
    }
    sentOtptoMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = (0, otpGen_util_1.default)();
                console.log(otp);
                yield this._OtpRespository.createOtp(email, otp);
                yield (0, nodemailer_util_1.nodeMailer)(email, otp);
            }
            catch (error) {
                throw new Error(`Failed to send otp to mail1${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    BLVerifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !otp) {
                    return { success: false, message: 'email or otp is missing' };
                }
                const data = yield this._OtpRespository.DBVerifyOtp(email, otp);
                if (!data) {
                    return { success: false, message: 'OTP does not match' };
                }
                const updateResult = yield this._OtpRespository.DBupdateMentee(data.email);
                if (updateResult.modifiedCount === 1) {
                    return { success: true, message: 'signup success' };
                }
                else {
                    return { success: false, message: 'User not found or already verified' };
                }
            }
            catch (error) {
                console.error('OTP verification error:', error);
                throw new Error(`Verification error: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = OtpService;
