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
const nodeMailer_util_1 = require("../Utils/nodeMailer.util");
const reusable_util_1 = require("../Utils/reusable.util");
class otpService {
    constructor(_otpRespository, _menteeRepository) {
        this._otpRespository = _otpRespository;
        this._menteeRepository = _menteeRepository;
    }
    sentOtptoMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = (0, reusable_util_1.genOtp)();
                console.log(otp);
                yield this._otpRespository.createOtp(email, otp);
                yield (0, nodeMailer_util_1.nodeMailer)(email, otp);
            }
            catch (error) {
                throw new Error(`Failed to send otp to mail ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    verifyOtp(email, otp, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(email, otp, "88888", type);
                if (!email || !otp || !type) {
                    return { success: false, message: "email or otp is missing" };
                }
                const data = yield this._otpRespository.verifyOtp(email, otp);
                if (!data) {
                    return { success: false, message: "OTP does not match" };
                }
                if (type == "signup") {
                    const updateResult = yield this._menteeRepository.updateMentee(data.email);
                    if (!updateResult) {
                        return {
                            success: false,
                            message: "User not found or already verified",
                        };
                    }
                }
                return { success: true, message: "Verified successfully" };
            }
            catch (error) {
                console.error("OTP verification error:", error);
                throw new Error(`Verification error: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = otpService;
