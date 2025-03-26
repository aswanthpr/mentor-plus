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
const httpStatusCode_1 = require("../Utils/httpStatusCode");
const reusable_util_1 = require("../Utils/reusable.util");
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
                console.log(refresh, "thsi is admin refrsh");
                if (!refresh) {
                    return { success: false, message: "RefreshToken missing", status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized };
                }
                const decode = (0, jwt_utils_1.verifyRefreshToken)(refresh, "admin");
                if (!(decode === null || decode === void 0 ? void 0 : decode.isValid) ||
                    !((_a = decode === null || decode === void 0 ? void 0 : decode.result) === null || _a === void 0 ? void 0 : _a.userId) ||
                    (decode === null || decode === void 0 ? void 0 : decode.error) == "TamperedToken" ||
                    (decode === null || decode === void 0 ? void 0 : decode.error) == "TokenExpired") {
                    return {
                        success: false,
                        message: "You are not authorized. Please log in.",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                const userId = (_b = decode === null || decode === void 0 ? void 0 : decode.result) === null || _b === void 0 ? void 0 : _b.userId;
                const accessToken = (0, jwt_utils_1.genAccesssToken)(userId, "admin");
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(userId, "admin");
                return {
                    success: true,
                    message: "Token refresh successfully",
                    accessToken,
                    refreshToken,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                console.error("Error while generating access or refresh token:", error);
                return { success: false, message: "Internal server error", status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError };
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
                        message: "input data is missing",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._categoryRepository.findCategory(category);
                if (result) {
                    return { success: false, message: "category is existing", status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Conflict };
                }
                const response = yield this._categoryRepository.createCategory(category);
                if ((response === null || response === void 0 ? void 0 : response.category) != category) {
                    return {
                        success: false,
                        message: "unexpected error happend",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Conflict,
                    };
                }
                return {
                    success: true,
                    message: "category created successfully",
                    result: response,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Created,
                };
            }
            catch (error) {
                throw new Error(`error while create category in service ${error instanceof Error ? error.message : String(error)}`);
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
                        message: "Invalid pagination or missing parameters",
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
                        message: "No categories found",
                        status: httpStatusCode_1.Status.BadRequest,
                        categories: [],
                        totalPage: 0,
                    };
                }
                const totalPage = Math.ceil((result === null || result === void 0 ? void 0 : result.totalDoc) / limitNo);
                return {
                    success: true,
                    message: "Data retrieved successfully",
                    status: httpStatusCode_1.Status.Ok,
                    categories: result === null || result === void 0 ? void 0 : result.category,
                    totalPage
                };
            }
            catch (error) {
                throw new Error(`Error while getting category data in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //category edit controll
    editCategory(id, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!category || !id) {
                    return { success: false, message: "credential is  missing" };
                }
                const resp = yield this._categoryRepository.findCategory(category);
                console.log(resp, "thsi is resp");
                if (resp) {
                    return { success: false, message: "category already exitst" };
                }
                const result = yield this._categoryRepository.editCategory(id, category);
                console.log(result, "this is edit categor result");
                if (!result) {
                    return { success: false, message: "category not found" };
                }
                return { success: true, message: "category edited successfully" };
            }
            catch (error) {
                throw new Error(`Error while eding category  in service: ${error instanceof Error ? error.message : String(error)}`);
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
                    return { success: false, message: "category not found", status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest };
                }
                return {
                    success: true,
                    message: "category Edited successfully",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new Error(`Error while change category status in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    menteeData(search, sortField, sortOrder, statusFilter, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!sortField || !statusFilter || !sortOrder || page < 1 || limit < 1) {
                    return {
                        success: false,
                        message: "Invalid pagination or missing parameters",
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
                    return { success: false,
                        message: "Users not  found",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        totalPage: 0,
                        Data: [] };
                }
                const totalPage = Math.ceil((result === null || result === void 0 ? void 0 : result.totalDoc) / limitNo);
                return {
                    success: true,
                    message: "Data retrieved successfully",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    Data: result === null || result === void 0 ? void 0 : result.mentees,
                    totalPage,
                };
            }
            catch (error) {
                throw new Error(`Error while get mentee data in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    changeMenteeStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    return {
                        success: false,
                        message: "credential is missing",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._menteeRepository.changeMenteeStatus(id);
                if (!result) {
                    return { success: false, message: "mentee not found", status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest };
                }
                return {
                    success: true,
                    message: "mentee Edited successfully",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new Error(`Error while update  mentee status in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    editMentee(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(formData);
                if (!formData) {
                    return { success: false, message: "credential is  missing" };
                }
                const result = yield this._menteeRepository.editMentee(formData);
                console.log(result, "this is edit mentee result");
                if (!result) {
                    return { success: false, message: "mentee not found" };
                }
                return {
                    success: true,
                    message: "Mentee updated successfully!",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new Error(`Error while Edit  mentee data in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    addMentee(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, bio } = formData;
                if (!name || !email || !phone || !bio) {
                    return { success: false, message: " credential is missing" };
                }
                const result = yield this._menteeRepository.findMentee(email);
                if (result) {
                    return { success: false, message: "email is existing" };
                }
                const response = yield this._menteeRepository.addMentee(formData);
                return {
                    success: true,
                    message: "mentee added successfully",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    mentee: response,
                };
            }
            catch (error) {
                throw new Error(`Error while add  mentee data in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //mentormanagement
    mentorData(search, activeTab, sortField, sortOrder, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(
                // skip,
                activeTab, limit, search, sortField, sortOrder, 'jkbofiaaaaaaa');
                if (!activeTab || !sortField || !sortOrder || 1 > page || 1 > limit) {
                    return {
                        success: false,
                        message: 'Invalid pagination or missing parameters',
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
                console.log(result, totalPage);
                if (!result) {
                    return {
                        success: false,
                        message: "Data not found",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NoContent,
                        mentorData: [],
                        totalPage: 0
                    };
                }
                return {
                    success: true,
                    message: "data successfully retrieved ",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    mentorData: result === null || result === void 0 ? void 0 : result.mentors,
                    totalPage
                };
            }
            catch (error) {
                throw new Error(`Error while add  mentor data in service: ${error instanceof Error ? error.message : String(error)}`);
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
                        message: "invalid crdiential",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        result: null,
                    };
                }
                const mentorId = new mongoose_1.default.Types.ObjectId(id);
                const response = yield this._mentorRepository.verifyMentor(mentorId);
                if (!response) {
                    return {
                        success: false,
                        message: "mentor not exist",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Conflict,
                        result: null,
                    };
                }
                yield this._notificationRepository.createNotification(mentorId, `Welcome ${response === null || response === void 0 ? void 0 : response.name}`, `Start exploring mentorPlus  and connect with mentees today.`, `mentor`, `${process.env.CLIENT_ORIGIN_URL}/mentor/schedule`);
                return {
                    success: true,
                    message: "mentor verified Successfully!",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    result: response,
                };
            }
            catch (error) {
                throw new Error(`Error while verify mentor in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //mentor status change logic
    mentorStatusChange(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return { success: false, message: "invalid crdiential", status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest };
                }
                const mentorId = new mongoose_1.default.Types.ObjectId(id);
                const result = yield this._mentorRepository.changeMentorStatus(mentorId);
                if (!result) {
                    return {
                        success: false,
                        message: "status updation failed!",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                return {
                    success: true,
                    message: "status updated successfully!",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new Error(`Error while change mentor status in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    dashboardData(timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const platformCommision = Number(process.env.PLATFORM_COMMISION);
                const salesData = yield this._slotScheduleRepository.mentorDashboard(platformCommision, timeRange);
                return {
                    message: "data successfuly recived",
                    success: true,
                    status: httpStatusCode_1.Status.Ok,
                    salesData,
                };
            }
            catch (error) {
                throw new Error(`Error while change mentor status in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.adminService = adminService;
