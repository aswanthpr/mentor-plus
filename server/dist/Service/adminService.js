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
            try {
                console.log(refresh, "thsi is admin refrsh");
                if (!refresh) {
                    return { success: false, message: "RefreshToken missing", status: 401 };
                }
                const decode = (0, jwt_utils_1.verifyRefreshToken)(refresh);
                if (!decode) {
                    return {
                        success: false,
                        message: "Your session has expired. Please log in again.",
                        status: 401,
                    };
                }
                const { userId } = decode;
                const accessToken = (0, jwt_utils_1.genAccesssToken)(userId);
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(userId);
                return {
                    success: true,
                    message: "Token refresh successfully",
                    accessToken,
                    refreshToken,
                    status: 200,
                };
            }
            catch (error) {
                console.error("Error while generating access or refresh token:", error);
                return { success: false, message: "Internal server error", status: 500 };
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
                        status: 400,
                    };
                }
                const result = yield this._categoryRepository.findCategory(category);
                if (result) {
                    return { success: false, message: "category is existing", status: 409 };
                }
                const response = yield this._categoryRepository.createCategory(category);
                if ((response === null || response === void 0 ? void 0 : response.category) != category) {
                    return {
                        success: false,
                        message: "unexpected error happend",
                        status: 409,
                    };
                }
                return {
                    success: true,
                    message: "category created successfully",
                    result: response,
                    status: 201,
                };
            }
            catch (error) {
                throw new Error(`error while create category in service ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //get category data to admin
    categoryData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._categoryRepository.categoryData();
                if (!result) {
                    return { success: false, message: "No categories found" };
                }
                return {
                    success: true,
                    message: "Data retrieved successfully",
                    categories: result,
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
                        status: 400,
                    };
                }
                const result = yield this._categoryRepository.changeCategoryStatus(id);
                if (!result) {
                    return { success: false, message: "category not found", status: 400 };
                }
                return {
                    success: true,
                    message: "category Edited successfully",
                    status: 200,
                };
            }
            catch (error) {
                throw new Error(`Error while change category status in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    menteeData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._menteeRepository.menteeData();
                if (!result) {
                    return { success: false, message: "Users not  found", status: 400 };
                }
                return {
                    success: true,
                    message: "Data retrieved successfully",
                    status: 200,
                    Data: result,
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
                        status: 400,
                    };
                }
                const result = yield this._menteeRepository.changeMenteeStatus(id);
                if (!result) {
                    return { success: false, message: "mentee not found", status: 400 };
                }
                return {
                    success: true,
                    message: "mentee Edited successfully",
                    status: 200,
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
                    status: 200,
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
                    status: 200,
                    mentee: response,
                };
            }
            catch (error) {
                throw new Error(`Error while add  mentee data in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //mentormanagement
    mentorData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._mentorRepository.findAllMentor();
                if (!result) {
                    return {
                        success: false,
                        message: "Data not found",
                        status: 204,
                        mentorData: [],
                    };
                }
                return {
                    success: true,
                    message: "data successfully retrieved ",
                    status: 200,
                    mentorData: result,
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
                        status: 400,
                        result: null,
                    };
                }
                const mentorId = new mongoose_1.default.Types.ObjectId(id);
                const response = yield this._mentorRepository.verifyMentor(mentorId);
                if (!response) {
                    return {
                        success: false,
                        message: "mentor not exist",
                        status: 409,
                        result: null,
                    };
                }
                yield this._notificationRepository.createNotification(mentorId, `Welcome ${response === null || response === void 0 ? void 0 : response.name}`, `Start exploring mentorPlus  and connect with mentees today.`, `mentor`, `${process.env.CLIENT_ORIGIN_URL}/mentor/schedule`);
                return {
                    success: true,
                    message: "mentor verified Successfully!",
                    status: 200,
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
                    return { success: false, message: "invalid crdiential", status: 400 };
                }
                const mentorId = new mongoose_1.default.Types.ObjectId(id);
                const result = yield this._mentorRepository.changeMentorStatus(mentorId);
                if (!result) {
                    return {
                        success: false,
                        message: "status updation failed!",
                        status: 400,
                    };
                }
                return {
                    success: true,
                    message: "status updated successfully!",
                    status: 200,
                };
            }
            catch (error) {
                throw new Error(`Error while change mentor status in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    dashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('haihel');
                const totalRevenue = yield this._slotScheduleRepository.findTotalRevenue();
                console.log(totalRevenue, 'this is toatlarevenue');
                return {
                    message: "data successfuly recived",
                    success: true,
                    status: httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new Error(`Error while change mentor status in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.adminService = adminService;
