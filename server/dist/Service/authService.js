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
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPass_util_1 = __importDefault(require("../Utils/hashPass.util"));
const jwt_utils_1 = require("../Utils/jwt.utils");
const cloudinary_util_1 = require("../Config/cloudinary.util");
const index_1 = require("../index");
const httpStatusCode_1 = require("../Utils/httpStatusCode");
class authService {
    constructor(_OtpService, _categoryRepository, _MentorRepository, _MenteeRepository, _notificationRepository) {
        this._OtpService = _OtpService;
        this._categoryRepository = _categoryRepository;
        this._MentorRepository = _MentorRepository;
        this._MenteeRepository = _MenteeRepository;
        this._notificationRepository = _notificationRepository;
    }
    mentee_Signup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userData.email || !userData.password) {
                    return {
                        success: false,
                        message: "Email or password is missing",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                console.log(userData === null || userData === void 0 ? void 0 : userData.email, userData === null || userData === void 0 ? void 0 : userData.password);
                const existingUser = yield this._MenteeRepository.findByEmail(userData === null || userData === void 0 ? void 0 : userData.email);
                console.log(existingUser);
                if (existingUser || (existingUser === null || existingUser === void 0 ? void 0 : existingUser.provider)) {
                    return {
                        success: false,
                        message: "user with this email is already exists",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                // pass hasing
                const hashPassword = yield (0, hashPass_util_1.default)(userData.password);
                userData.password = hashPassword;
                const response = yield this._MenteeRepository.create_Mentee(userData);
                if (!response) {
                    return {
                        success: false,
                        message: "Singup Failed",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const notfi = yield this._notificationRepository.createNotification(response === null || response === void 0 ? void 0 : response._id, `Welcome ${response === null || response === void 0 ? void 0 : response.name}`, `Start exploring and connect with mentors today.`, `mentee`, `${process.env.CLIENT_ORIGIN_URL}/mentee/explore`);
                if ((response === null || response === void 0 ? void 0 : response.id) && notfi) {
                    index_1.socketManager.sendNotification(response === null || response === void 0 ? void 0 : response._id, notfi);
                }
                return {
                    success: true,
                    message: "signup successfull",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
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
    mainLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    return {
                        success: false,
                        message: "login credencial is missing",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._MenteeRepository.mainLogin(email);
                if ((result === null || result === void 0 ? void 0 : result.provider) != "email") {
                    return {
                        success: false,
                        message: "please login with google",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                if (!result || (result === null || result === void 0 ? void 0 : result.email) != email) {
                    return {
                        success: false,
                        message: "user not exist.Please signup",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                if (result === null || result === void 0 ? void 0 : result.isAdmin) {
                    return {
                        success: false,
                        message: "Admin is not allowed ,sorry..",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                if (result === null || result === void 0 ? void 0 : result.isBlocked) {
                    return {
                        success: false,
                        message: "user blocked .sorry..",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                const checkUser = yield bcrypt_1.default.compare(password, result === null || result === void 0 ? void 0 : result.password);
                if (!checkUser) {
                    return {
                        success: false,
                        message: "password not matching",
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                const userId = result._id;
                const accessToken = (0, jwt_utils_1.genAccesssToken)(userId, "mentee");
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(userId, "mentee");
                return {
                    success: true,
                    message: "Login Successfull",
                    refreshToken,
                    accessToken,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new Error(`error in Login service ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //forget password mentor and mentee;
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email) {
                    return { success: false, message: "credential is missing" };
                }
                const result = yield this._MenteeRepository.findByEmail(email);
                if (!result || (result === null || result === void 0 ? void 0 : result.isBlocked)) {
                    return {
                        success: false,
                        message: "Invalid user type. Otp failed to send",
                    };
                }
                yield this._OtpService.sentOtptoMail(email);
                return { success: true, message: "Otp success fully send to mail" };
            }
            catch (error) {
                console.log(`error while forget password in BLforgetPassword`, error instanceof Error ? error.message : String(error));
            }
        });
    }
    forgot_PasswordChange(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    return { success: false, message: "credencial is missing" };
                }
                const hashedPassword = yield (0, hashPass_util_1.default)(password);
                console.log(hashedPassword, "hash");
                const result = yield this._MenteeRepository.forgot_PasswordChange(email, hashedPassword);
                console.log(result, "ths is passchange reslut");
                if (!result) {
                    return {
                        success: false,
                        message: "User does not exist. Please sign up.",
                    };
                }
                return { success: true, message: "password changed successfully." };
            }
            catch (error) {
                console.log(`error while forget password in BLforgetPassword`, error instanceof Error ? error.message : String(error));
                return { success: false, message: "Internal server error" };
            }
        });
    }
    //amdin login Logic
    mentorFields() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._categoryRepository.allCategoryData();
                if (!result) {
                    return {
                        success: false,
                        message: "No data found ",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NoContent,
                    };
                }
                return {
                    success: true,
                    message: "data found",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    categories: result,
                };
            }
            catch (error) {
                throw new Error(`error while forget password in BLforgetPassword
        ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    return { success: false, message: "admin credencial is missing", status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest, refreshToken: null,
                        accessToken: null, };
                }
                const result = yield this._MenteeRepository.findByEmail(email);
                // adminLogin(email);
                if (!result) {
                    return { success: false, message: "Admin not exist", status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest, refreshToken: null,
                        accessToken: null, };
                }
                if (!(result === null || result === void 0 ? void 0 : result.isAdmin)) {
                    return { success: false, message: "user is not allowed ,sorry..", status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest, refreshToken: null,
                        accessToken: null, };
                }
                if (result === null || result === void 0 ? void 0 : result.isBlocked) {
                    return { success: false, message: "Admin blocked .sorry..", status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest, refreshToken: null,
                        accessToken: null, };
                }
                const checkUser = yield bcrypt_1.default.compare(password, result === null || result === void 0 ? void 0 : result.password);
                if (!checkUser) {
                    return { success: false, message: "password not matching", status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest, refreshToken: null,
                        accessToken: null, };
                }
                const userId = result._id;
                const accessToken = (0, jwt_utils_1.genAccesssToken)(userId, "admin");
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(userId, "admin");
                console.log(accessToken, refreshToken, "access refrsh");
                return {
                    success: true,
                    message: "Login Successfull",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    accessToken,
                    refreshToken,
                };
            }
            catch (error) {
                console.error(error instanceof Error ? error.message : String(error), "Error while loging admin", error);
                return {
                    success: false,
                    message: "An error occurred during admin login",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError,
                    refreshToken: null,
                    accessToken: null,
                };
            }
        });
    }
    mentorApply(mentorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, phone } = mentorData.body;
                const { profileImage, resume } = mentorData.files;
                if (!mentorData.body || !mentorData.files) {
                    return {
                        success: false,
                        message: "credential is missing",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const response = yield this._MentorRepository.findMentor(email, phone);
                if (response === null || response === void 0 ? void 0 : response.email) {
                    return { success: false, message: "Email already exist ", status: 409 };
                }
                if (response === null || response === void 0 ? void 0 : response.phone) {
                    return { success: false, message: "phone already exist ", status: 409 };
                }
                const hashPass = yield (0, hashPass_util_1.default)(mentorData.body.password);
                if (!hashPass) {
                    throw new Error("error while hashing password in mentor apply");
                }
                mentorData.body = Object.assign(Object.assign({}, mentorData.body), { password: hashPass });
                const imageUrl = yield (0, cloudinary_util_1.uploadImage)(profileImage === null || profileImage === void 0 ? void 0 : profileImage.buffer);
                const fileUrl = yield (0, cloudinary_util_1.uploadFile)(resume === null || resume === void 0 ? void 0 : resume.buffer, resume === null || resume === void 0 ? void 0 : resume.originalname);
                console.log(imageUrl, fileUrl);
                if (!imageUrl || !fileUrl) {
                    throw new Error("error while image url generating");
                }
                const result = yield this._MentorRepository.createMentor(mentorData.body, imageUrl, fileUrl);
                if (!result) {
                    return {
                        success: false,
                        message: "unable to create user ",
                        status: 409,
                    };
                }
                const admin = yield this._MenteeRepository._find();
                const notifi = yield this._notificationRepository.createNotification(admin === null || admin === void 0 ? void 0 : admin._id, `New Mentor Has Joined!`, `${result === null || result === void 0 ? void 0 : result.name} Applied as mentor. Please review their profile and verify`, "admin", `${process.env.CLIENT_ORIGIN_URL}/admin/mentor_management/not_verified`);
                if ((admin === null || admin === void 0 ? void 0 : admin._id) && notifi) {
                    index_1.socketManager.sendNotification(admin === null || admin === void 0 ? void 0 : admin._id, notifi);
                }
                return {
                    success: true,
                    message: "Mentor application submitted!",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                console.error("Error while mentor appling", error);
                return {
                    success: false,
                    message: "unexpected error occured",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError,
                };
            }
        });
    }
    //mentor login
    mentorLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    return {
                        success: false,
                        message: `${!email ? "email is required" : "password is required"}`,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._MentorRepository.findMentor(email);
                if (!result) {
                    return {
                        success: false,
                        message: "user with the provided email not found",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NotFound,
                    };
                }
                if (!(result === null || result === void 0 ? void 0 : result.verified)) {
                    return {
                        success: false,
                        message: `You're on our waitlist!
                   Thanks for signing up for MentorPlus.
                    We're focused on creating the best experience possible for everyone on the site.`,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                if (result === null || result === void 0 ? void 0 : result.isBlocked) {
                    return {
                        success: false,
                        message: "User is  Blocked!",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                const checkPass = yield bcrypt_1.default.compare(password, result === null || result === void 0 ? void 0 : result.password);
                console.log(checkPass);
                if (!checkPass) {
                    return {
                        success: false,
                        message: "Incorrect password",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const mentorId = `${result._id}`;
                console.log(mentorId, "userid");
                const accessToken = (0, jwt_utils_1.genAccesssToken)(mentorId, "mentor");
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(mentorId, "mentor");
                console.log(accessToken, refreshToken, "access refrsh");
                return {
                    success: true,
                    message: "login successfull!",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    accessToken,
                    refreshToken,
                };
            }
            catch (error) {
                throw new Error(`error while forget password in BLforgetPassword
      ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    mentorForgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email) {
                    return { success: false, message: "credential is missing" };
                }
                const result = yield this._MentorRepository.findMentor(email);
                if (!result || (result === null || result === void 0 ? void 0 : result.isBlocked)) {
                    return {
                        success: false,
                        message: "Invalid user type. Otp failed to send",
                    };
                }
                yield this._OtpService.sentOtptoMail(email);
                return { success: true, message: "Otp success fully send to mail" };
            }
            catch (error) {
                console.log(`error while forget password in BLMentorforgetPassword`, error instanceof Error ? error.message : String(error));
            }
        });
    }
    mentorForgot_PasswordChange(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    return { success: false, message: "credencial is missing" };
                }
                const hashedPassword = yield (0, hashPass_util_1.default)(password);
                console.log(hashedPassword, "hash");
                const result = yield this._MentorRepository.findMentorAndUpdate(email, hashedPassword);
                console.log(result, "ths is passchange reslut");
                if (!result) {
                    return {
                        success: false,
                        message: "User does not exist. Please sign up.",
                    };
                }
                return { success: true, message: "password changed successfully." };
            }
            catch (error) {
                console.log(`error while forget password in BLforgetPassword`, error instanceof Error ? error.message : String(error));
                return { success: false, message: "Internal server error" };
            }
        });
    }
    googleAuth(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!user) {
                    throw new Error("user deailes not found");
                }
                const accessToken = (0, jwt_utils_1.genAccesssToken)(user === null || user === void 0 ? void 0 : user._id, "mentee");
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(user === null || user === void 0 ? void 0 : user._id, "mentee");
                console.log(refreshToken, "sfkasdsdfjsjflkslfkjskldjflaskdfjlkasjd", accessToken);
                return {
                    success: true,
                    message: "login successfull!",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    accessToken,
                    refreshToken,
                };
            }
            catch (error) {
                throw new Error(`error while google authentication
      ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.authService = authService;
