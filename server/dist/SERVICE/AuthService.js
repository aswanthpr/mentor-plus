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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const otpGen_util_1 = __importDefault(require("../UTILS/otpGen.util"));
const nodemailer_util_1 = require("../UTILS/nodemailer.util");
class AuthService {
    constructor(_AuthRepository) {
        this._AuthRepository = _AuthRepository;
    }
    mentee_Signup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('this is service');
                const existingUser = yield this._AuthRepository.findByEmail(userData.email);
                if (existingUser) {
                    throw new Error('user with this email is already exists');
                }
                const salt = yield bcrypt_1.default.genSalt(10);
                console.log(salt, '\x1b[32m%s\x1b[0m ths is salt');
                const hashPassword = yield bcrypt_1.default.hash(userData.password, salt);
                userData.password = hashPassword;
                const newMentee = yield this._AuthRepository.createMentee(userData);
                console.log(newMentee, 'thsi is from service');
                const otp = (0, otpGen_util_1.default)();
                const saveOtp = yield this._AuthRepository;
                console.log(otp, 'thsi is the new otp');
                yield (0, nodemailer_util_1.nodeMailer)(userData.email, Number(otp));
                return newMentee;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('\x1b[35m%s\x1b[0m', 'error while create mentee');
                    throw new Error(`Failed to create  Mentee ${error.message}`);
                }
                else {
                    console.log('An unknown error occured', error);
                    throw error;
                }
            }
        });
    }
    verifyOtp(otp) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.AuthService = AuthService;
