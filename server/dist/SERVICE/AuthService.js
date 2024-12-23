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
const jwt_utils_1 = require("../UTILS/jwt.utils");
const hashPass_util_1 = __importDefault(require("../UTILS/hashPass.util"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor(_AuthRepository, _OtpService) {
        this._AuthRepository = _AuthRepository;
        this._OtpService = _OtpService;
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
                const newMentee = yield this._AuthRepository.create_Mentee(userData);
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
    BLMainLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(email, password);
                console.log(email, password, "logic");
                if (!email || !password) {
                    return { success: false, message: "login credencial is missing" };
                }
                const result = yield this._AuthRepository.DBMainLogin(email);
                if (!result) {
                    return { success: false, message: "user not exist.Please signup" };
                }
                if (result === null || result === void 0 ? void 0 : result.isAdmin) {
                    return { success: false, message: "Admin is not allowed ,sorry.." };
                }
                if (result === null || result === void 0 ? void 0 : result.isBlocked) {
                    return { success: false, message: "user blocked .sorry.." };
                }
                const checkUser = yield bcrypt_1.default.compare(password, result === null || result === void 0 ? void 0 : result.password);
                if (!checkUser) {
                    return { success: false, message: "password not matching" };
                }
                const userId = result._id;
                console.log(userId, "userid");
                const accessToken = (0, jwt_utils_1.genAccesssToken)(userId);
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(userId);
                console.log(accessToken, refreshToken, "access refrsh");
                return {
                    success: true,
                    message: "Login Successfull",
                    refreshToken,
                    accessToken,
                };
            }
            catch (error) {
                throw new Error(`error in Login service ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //forget password mentor and mentee;
    BLforgotPassword(email, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !userType) {
                    return { success: false, message: "credential is missing" };
                }
                if (userType == 'mentee') {
                    const result = yield this._AuthRepository.findByEmail(email);
                    if (!result || (result === null || result === void 0 ? void 0 : result.isBlocked)) {
                        return { success: false, message: 'cannot find user' };
                    }
                    yield this._OtpService.sentOtptoMail(email);
                    return { success: true, message: 'Otp success fully send to mail' };
                }
                // Handle unsupported user types.
                return { success: false, message: 'Invalid user type. Otp failed to send' };
            }
            catch (error) {
                console.log(`error while forget password in BLforgetPassword`, error instanceof Error ? error.message : String(error));
            }
        });
    }
    BLforgot_PasswordChange(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    return { success: false, message: "credencial is missing" };
                }
                const hashedPassword = yield (0, hashPass_util_1.default)(password);
                console.log(hashedPassword, 'hash');
                const result = yield this._AuthRepository.DBforgot_PasswordChange(email, hashedPassword);
                console.log(result, "ths is passchnge reslut");
                if (!result) {
                    return { success: false, message: 'User does not exist. Please sign up.' };
                }
                return { success: true, message: 'password changed successfully.' };
            }
            catch (error) {
                console.log(`error while forget password in BLforgetPassword`, error instanceof Error ? error.message : String(error));
                return { success: false, message: 'Internal server error' };
            }
        });
    }
    BLAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!refreshToken) {
                    return { success: false, message: "RefreshToken missing" };
                }
                const decode = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                if (!(decode === null || decode === void 0 ? void 0 : decode.userId)) {
                    return { success: false, message: "Invalid token payload" };
                }
                let { userId } = decode;
                const userData = yield this._AuthRepository.DBfindBy_id(userId);
                if (!userData) {
                    return { success: false, message: "Invalid token payload" };
                }
                userId = userData === null || userData === void 0 ? void 0 : userData._id;
                const accessToken = jsonwebtoken_1.default.sign({ userId: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
                return {
                    success: true,
                    message: "Token refresh success fully",
                    accessToken,
                    refreshToken,
                };
            }
            catch (error) {
                console.error("Error while generating BLRefreshToken", error);
                return { success: false, message: "Invalid or expired refresh token" };
            }
        });
    }
    //amdin login Logic
    BLadminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    return { success: false, message: "admin credencial is missing" };
                }
                const result = yield this._AuthRepository.DBadminLogin(email);
                if (!result) {
                    return { success: false, message: "Admin not exist" };
                }
                if (!(result === null || result === void 0 ? void 0 : result.isAdmin)) {
                    return { success: false, message: "user is not allowed ,sorry.." };
                }
                if (result === null || result === void 0 ? void 0 : result.isBlocked) {
                    return { success: false, message: "Admin blocked .sorry.." };
                }
                const checkUser = yield bcrypt_1.default.compare(password, result === null || result === void 0 ? void 0 : result.password);
                if (!checkUser) {
                    return { success: false, message: "password not matching" };
                }
                const userId = result._id;
                console.log(userId, "userid");
                const accessToken = (0, jwt_utils_1.genAccesssToken)(userId);
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(userId);
                console.log(accessToken, refreshToken, "access refrsh");
                return {
                    success: true,
                    message: "Login Successfull",
                    refreshToken,
                    accessToken,
                };
            }
            catch (error) {
                console.error("Error while loging admin", error);
                return { success: false, message: "Admin does't exist" };
            }
        });
    }
}
exports.AuthService = AuthService;
