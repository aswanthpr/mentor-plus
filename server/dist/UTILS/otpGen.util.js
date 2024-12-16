"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = genOtp;
const otp_generator_1 = __importDefault(require("otp-generator"));
function genOtp() {
    return otp_generator_1.default.generate(6, { upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        digits: true,
        specialChars: false
    });
}
