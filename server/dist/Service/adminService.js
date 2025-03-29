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
exports.adminService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_utils_1 = require("../Utils/jwt.utils");
const httpStatusCode_1 = require("../Constants/httpStatusCode");
const reusable_util_1 = require("../Utils/reusable.util");
const httpResponse_1 = require("../Constants/httpResponse");
const http_error_handler_util_1 = require("../Utils/http-error-handler.util");
class adminService {
    constructor(_categoryRepository, _menteeRepository, _mentorRepository, _notificationRepository, _slotScheduleRepository) {
        this._categoryRepository = _categoryRepository;
        this._menteeRepository = _menteeRepository;
        this._mentorRepository = _mentorRepository;
        this._notificationRepository = _notificationRepository;
        this._slotScheduleRepository = _slotScheduleRepository;
    }
    adminRefreshToken(refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!refresh) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.NO_TOKEN, status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized };
                }
                const decode = (0, jwt_utils_1.verifyRefreshToken)(refresh, "admin");
                if (!(decode === null || decode === void 0 ? void 0 : decode.isValid) ||
                    !((_a = decode === null || decode === void 0 ? void 0 : decode.result) === null || _a === void 0 ? void 0 : _a.userId) ||
                    (decode === null || decode === void 0 ? void 0 : decode.error) == "TamperedToken" ||
                    (decode === null || decode === void 0 ? void 0 : decode.error) == "TokenExpired") {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.UNAUTHORIZED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                const userId = (_b = decode === null || decode === void 0 ? void 0 : decode.result) === null || _b === void 0 ? void 0 : _b.userId;
                const accessToken = (0, jwt_utils_1.genAccesssToken)(userId, "admin");
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(userId, "admin");
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.TOKEN_GENERATED,
                    accessToken,
                    refreshToken,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    createCategory(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category } = Data;
                if (!category) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._categoryRepository.findCategory(category);
                if (result) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.CATEOGRY_EXIST, status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Conflict };
                }
                const response = yield this._categoryRepository.createCategory(category);
                if ((response === null || response === void 0 ? void 0 : response.category) != category) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Conflict,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.CATEGORY_CREATED,
                    result: response,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Created,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //get category data to admin
    categoryData(searchQuery, statusFilter, sortField, sortOrder, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!sortField || !statusFilter || !sortOrder || page < 1 || limit < 1) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        categories: [],
                        totalPage: 0,
                    };
                }
                const skipData = (0, reusable_util_1.createSkip)(page, limit);
                const limitNo = skipData === null || skipData === void 0 ? void 0 : skipData.limitNo;
                const skip = skipData === null || skipData === void 0 ? void 0 : skipData.skip;
                const result = yield this._categoryRepository.categoryData(searchQuery, statusFilter, sortField, sortOrder, skip, limitNo);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.CATEGORY_NOTFOUND,
                        status: httpStatusCode_1.Status.BadRequest,
                        categories: [],
                        totalPage: 0,
                    };
                }
                const totalPage = Math.ceil((result === null || result === void 0 ? void 0 : result.totalDoc) / limitNo);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    status: httpStatusCode_1.Status.Ok,
                    categories: result === null || result === void 0 ? void 0 : result.category,
                    totalPage
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //category edit controll
    editCategory(id, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!category || !id) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS };
                }
                const resp = yield this._categoryRepository.findCategory(category);
                if (resp) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.CATEOGRY_EXIST };
                }
                const result = yield this._categoryRepository.editCategory(id, category);
                if (!result) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.CATEGORY_NOTFOUND };
                }
                return { success: true, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.CATEGORY_EDITED };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    changeCategoryStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    return {
                        success: false,
                        message: "credential is missing",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._categoryRepository.changeCategoryStatus(id);
                if (!result) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.CATEGORY_NOTFOUND, status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.CATEGORY_EDITED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    menteeData(search, sortField, sortOrder, statusFilter, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!sortField || !statusFilter || !sortOrder || page < 1 || limit < 1) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        Data: [],
                        totalPage: 0,
                    };
                }
                const pageNo = Math.max(page, 1);
                const limitNo = Math.max(limit, 1);
                const skip = (pageNo - 1) * limitNo;
                const result = yield this._menteeRepository.menteeData(skip, limitNo, search, sortOrder, sortField, statusFilter);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        totalPage: 0,
                        Data: []
                    };
                }
                const totalPage = Math.ceil((result === null || result === void 0 ? void 0 : result.totalDoc) / limitNo);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    Data: result === null || result === void 0 ? void 0 : result.mentees,
                    totalPage,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    changeMenteeStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._menteeRepository.changeMenteeStatus(id);
                if (!result) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND, status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.CHANGES_APPLIED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    editMentee(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!formData) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS };
                }
                const result = yield this._menteeRepository.editMentee(formData);
                if (!result) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.CHANGES_APPLIED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    addMentee(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, bio } = formData;
                if (!name || !email || !phone || !bio) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS };
                }
                const result = yield this._menteeRepository.findMentee(email);
                if (result) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.EMAIL_EXIST };
                }
                const response = yield this._menteeRepository.addMentee(formData);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_CREATION_SUCCESS,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    mentee: response,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //mentormanagement
    mentorData(search, activeTab, sortField, sortOrder, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!activeTab || !sortField || !sortOrder || 1 > page || 1 > limit) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        mentorData: [],
                        totalPage: 0
                    };
                }
                const pageNo = Math.max(page, 1);
                const limitNo = Math.max(limit, 1);
                const skip = (pageNo - 1) * limitNo;
                const result = yield this._mentorRepository.findAllMentor(skip, limitNo, activeTab, search, sortField, sortOrder);
                const totalPage = Math.ceil((result === null || result === void 0 ? void 0 : result.totalDoc) / limitNo);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NoContent,
                        mentorData: [],
                        totalPage: 0
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    mentorData: result === null || result === void 0 ? void 0 : result.mentors,
                    totalPage
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //herer  the mentor verification logic
    mentorVerify(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        result: null,
                    };
                }
                const mentorId = new mongoose_1.default.Types.ObjectId(id);
                const response = yield this._mentorRepository.verifyMentor(mentorId);
                if (!response) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Conflict,
                        result: null,
                    };
                }
                yield this._notificationRepository.createNotification(mentorId, `Welcome ${response === null || response === void 0 ? void 0 : response.name}`, `Start exploring mentorPlus  and connect with mentees today.`, `mentor`, `${process.env.CLIENT_ORIGIN_URL}/mentor/schedule`);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_VERIFIED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    result: response,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //mentor status change logic
    mentorStatusChange(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS, status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest };
                }
                const mentorId = new mongoose_1.default.Types.ObjectId(id);
                const result = yield this._mentorRepository.changeMentorStatus(mentorId);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_UPDATE_FAILED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_UPDATED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    dashboardData(timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const platformCommision = Number(process.env.PLATFORM_COMMISION);
                const salesData = yield this._slotScheduleRepository.mentorDashboard(platformCommision, timeRange);
                return {
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    success: true,
                    status: httpStatusCode_1.Status.Ok,
                    salesData,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.adminService = adminService;
