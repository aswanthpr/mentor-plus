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
const httpStatusCode_1 = require("../Constants/httpStatusCode");
const httpResponse_1 = require("../Constants/httpResponse");
const http_error_handler_util_1 = require("../Utils/http-error-handler.util");
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
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const existingUser = yield this._MenteeRepository.findByEmail(userData === null || userData === void 0 ? void 0 : userData.email);
                if (((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) && (existingUser === null || existingUser === void 0 ? void 0 : existingUser.verified)) || (existingUser === null || existingUser === void 0 ? void 0 : existingUser.provider) === "google") {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.EMAIL_EXIST,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                else if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) && !(existingUser === null || existingUser === void 0 ? void 0 : existingUser.verified)) {
                    return {
                        success: true,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    };
                }
                // pass hasing
                const hashPassword = yield (0, hashPass_util_1.default)(userData.password);
                userData.password = hashPassword;
                const response = yield this._MenteeRepository.create_Mentee(userData);
                if (!response) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.FAILED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const notfi = yield this._notificationRepository.createNotification(response === null || response === void 0 ? void 0 : response._id, `Welcome ${response === null || response === void 0 ? void 0 : response.name}`, httpResponse_1.NOTIFY === null || httpResponse_1.NOTIFY === void 0 ? void 0 : httpResponse_1.NOTIFY.MENTEE_WELCOME, `mentee`, `${process.env.CLIENT_ORIGIN_URL}/mentee/explore`);
                if ((response === null || response === void 0 ? void 0 : response.id) && notfi) {
                    index_1.socketManager.sendNotification(response === null || response === void 0 ? void 0 : response._id, notfi);
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    mainLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._MenteeRepository.mainLogin(email);
                if ((result === null || result === void 0 ? void 0 : result.provider) != "email") {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.LOGIN_WITH_GOOGLE,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                if (!result || (result === null || result === void 0 ? void 0 : result.email) != email) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                if (result === null || result === void 0 ? void 0 : result.isAdmin) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.ADMIN_NOT_ALLOWEDED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                if (result === null || result === void 0 ? void 0 : result.isBlocked) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_BLOCKED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                const checkUser = yield bcrypt_1.default.compare(password, result === null || result === void 0 ? void 0 : result.password);
                if (!checkUser) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.PASSWORD_INCORRECT,
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                const userId = result._id;
                const accessToken = (0, jwt_utils_1.genAccesssToken)(userId, "mentee");
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(userId, "mentee");
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    refreshToken,
                    accessToken,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //forget password mentor and mentee;
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._MenteeRepository.findByEmail(email);
                if (!(result === null || result === void 0 ? void 0 : result.email) || (result === null || result === void 0 ? void 0 : result.isBlocked)) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                yield this._OtpService.sentOtptoMail(email);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.OTP_SEND_TO_MAIL,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    forgot_PasswordChange(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const hashedPassword = yield (0, hashPass_util_1.default)(password);
                const result = yield this._MenteeRepository.forgot_PasswordChange(email, hashedPassword);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.PASSWORD_CHANGE_SUCCESS,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
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
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NoContent,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_FOUND,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    categories: result,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        refreshToken: null,
                        accessToken: null,
                    };
                }
                const result = yield this._MenteeRepository.findByEmail(email);
                // adminLogin(email);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        refreshToken: null,
                        accessToken: null,
                    };
                }
                if (!(result === null || result === void 0 ? void 0 : result.isAdmin)) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.UNAUTHORIZED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        refreshToken: null,
                        accessToken: null,
                    };
                }
                if (result === null || result === void 0 ? void 0 : result.isBlocked) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.UNAUTHORIZED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        refreshToken: null,
                        accessToken: null,
                    };
                }
                const checkUser = yield bcrypt_1.default.compare(password, result === null || result === void 0 ? void 0 : result.password);
                if (!checkUser) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.PASSWORD_INCORRECT,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        refreshToken: null,
                        accessToken: null,
                    };
                }
                const userId = result._id;
                const accessToken = (0, jwt_utils_1.genAccesssToken)(userId, "admin");
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(userId, "admin");
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    accessToken,
                    refreshToken,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    mentorApply(mentorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, phone } = mentorData.body;
                const { profileImage, resume } = mentorData.files;
                if (!email || !phone || !profileImage || !resume || !(mentorData === null || mentorData === void 0 ? void 0 : mentorData.files)) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const response = yield this._MentorRepository.findMentor(email, phone);
                if (response === null || response === void 0 ? void 0 : response.email) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.EMAIL_EXIST,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Conflict,
                    };
                }
                if (response === null || response === void 0 ? void 0 : response.phone) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.PHONE_EXIST,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Conflict,
                    };
                }
                const hashPass = yield (0, hashPass_util_1.default)(mentorData.body.password);
                if (!hashPass) {
                    throw new Error("error while hashing password in mentor apply");
                }
                mentorData.body = Object.assign(Object.assign({}, mentorData.body), { password: hashPass });
                const imageUrl = yield (0, cloudinary_util_1.uploadImage)(profileImage === null || profileImage === void 0 ? void 0 : profileImage.buffer);
                const fileUrl = yield (0, cloudinary_util_1.uploadFile)(resume === null || resume === void 0 ? void 0 : resume.buffer, resume === null || resume === void 0 ? void 0 : resume.originalname);
                if (!imageUrl || !fileUrl) {
                    throw new Error("error while image url generating");
                }
                const result = yield this._MentorRepository.createMentor(mentorData.body, imageUrl, fileUrl);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_CREATION_FAILED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Conflict,
                    };
                }
                const admin = yield this._MenteeRepository._find();
                const notifi = yield this._notificationRepository.createNotification(admin === null || admin === void 0 ? void 0 : admin._id, `New Mentor Has Joined!`, `${result === null || result === void 0 ? void 0 : result.name} ${httpResponse_1.NOTIFY === null || httpResponse_1.NOTIFY === void 0 ? void 0 : httpResponse_1.NOTIFY.ADMIN_NEW_MENTOR_NOTIFY}`, "admin", `${process.env.CLIENT_ORIGIN_URL}/admin/mentor_management/not_verified`);
                if ((admin === null || admin === void 0 ? void 0 : admin._id) && notifi) {
                    index_1.socketManager.sendNotification(String(admin === null || admin === void 0 ? void 0 : admin._id), notifi);
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.APPLICATION_SUBMITTED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
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
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._MentorRepository.findMentor(email);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_EMAIL,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NotFound,
                    };
                }
                if (!(result === null || result === void 0 ? void 0 : result.verified)) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.MENTEE_NOTIFICATION,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                if (result === null || result === void 0 ? void 0 : result.isBlocked) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.UNAUTHORIZED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                const checkPass = yield bcrypt_1.default.compare(password, result === null || result === void 0 ? void 0 : result.password);
                if (!checkPass) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.PASSWORD_INCORRECT,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const mentorId = `${result._id}`;
                const accessToken = (0, jwt_utils_1.genAccesssToken)(mentorId, "mentor");
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(mentorId, "mentor");
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    accessToken,
                    refreshToken,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    mentorForgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._MentorRepository.findMentor(email);
                if (!result || (result === null || result === void 0 ? void 0 : result.isBlocked)) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.OTP_FAILED_TO_SEND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                yield this._OtpService.sentOtptoMail(email);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.OTP_SEND_TO_MAIL,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    mentorForgot_PasswordChange(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const hashedPassword = yield (0, hashPass_util_1.default)(password);
                const result = yield this._MentorRepository.findMentorAndUpdate(email, hashedPassword);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NotFound,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.PASSWORD_CHANGE_SUCCESS,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
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
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    accessToken,
                    refreshToken,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.authService = authService;
