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
const hashPass_util_1 = __importDefault(require("../UTILS/hashPass.util"));
class AuthService {
    constructor(_AuthRepository) {
        this._AuthRepository = _AuthRepository;
    }
    mentee_Signup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userData.email || !userData.password) {
                    return { success: false, message: "Email or password is missing" };
                }
                const existingUser = yield this._AuthRepository.findByEmail(userData.email);
                if (existingUser) {
                    return {
                        success: false,
                        message: "user with this email is already exists",
                    };
                }
                // pass hasing 
                const hashPassword = yield (0, hashPass_util_1.default)(userData.password);
                userData.password = hashPassword;
                const newMentee = yield this._AuthRepository.createMentee(userData);
                return { success: true, message: "signup successfull" };
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("\x1b[35m%s\x1b[0m", "error while create mentee");
                    throw new Error(`Failed to create  Mentee ${error.message}`);
                }
                else {
                    console.log("An unknown error occured", error);
                    throw error;
                }
            }
        });
    }
    BLMainLogin(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = userData;
                console.log(email, password, 'logic');
                if (!email || !password) {
                    return { success: false, message: 'login credencial is missing' };
                }
                const result = yield this._AuthRepository.DBMainLogin(email);
                console.log(result, 'this is the result of checkng logining user');
                if (!result) {
                    return { success: false, message: 'user not exist.Please signup' };
                }
                const checkUser = yield bcrypt_1.default.compare(password, result === null || result === void 0 ? void 0 : result.password);
                if (!checkUser) {
                    return { success: false, message: "password not matching" };
                }
                return { success: true, message: 'Login Successfull' };
            }
            catch (error) {
                throw new Error(`error in Login service ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.AuthService = AuthService;
