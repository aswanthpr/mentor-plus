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
const otpModel_1 = __importDefault(require("../Model/otpModel"));
class otpRepository {
    createOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveOtp = new otpModel_1.default({ email, otp });
                const data = yield saveOtp.save();
                console.log(data, 'otp created');
                return data;
            }
            catch (error) {
                throw new Error(`${'\x1b[35m%s\x1b[0m'}error while creating otp:${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield otpModel_1.default.findOne({ email, otp }).exec();
                console.log('OTP found in database:', data);
                return data;
            }
            catch (error) {
                throw new Error(`error while find on database in verify otp  ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = new otpRepository();
