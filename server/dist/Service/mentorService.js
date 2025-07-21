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
exports.mentorService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const rrule_1 = require("rrule");
const jwt_utils_1 = require("../Utils/jwt.utils");
const hashPass_util_1 = __importDefault(require("../Utils/hashPass.util"));
const cloudinary_util_1 = require("../Config/cloudinary.util");
const httpStatusCode_1 = require("../Constants/httpStatusCode");
const moment_1 = __importDefault(require("moment"));
const reusable_util_1 = require("../Utils/reusable.util");
const httpResponse_1 = require("../Constants/httpResponse");
const http_error_handler_util_1 = require("../Utils/http-error-handler.util");
const mentorDTO_1 = require("../dto/mentor/mentorDTO");
class mentorService {
    constructor(_mentorRepository, _categoryRepository, _questionRepository, _timeSlotRepository, _slotScheduleRepository) {
        this._mentorRepository = _mentorRepository;
        this._categoryRepository = _categoryRepository;
        this._questionRepository = _questionRepository;
        this._timeSlotRepository = _timeSlotRepository;
        this._slotScheduleRepository = _slotScheduleRepository;
    }
    mentorProfile(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const decode = (0, jwt_utils_1.verifyAccessToken)(token, "mentor");
                if (!((_a = decode === null || decode === void 0 ? void 0 : decode.result) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.UNAUTHORIZED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Forbidden,
                        result: null,
                        categories: [],
                    };
                }
                const result = yield this._mentorRepository.findMentorById((_b = decode === null || decode === void 0 ? void 0 : decode.result) === null || _b === void 0 ? void 0 : _b.userId);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NoContent,
                        result: null,
                        categories: [],
                    };
                }
                const categoryData = yield this._categoryRepository.allCategoryData();
                if (!categoryData) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NoContent,
                        result: null,
                        categories: [],
                    };
                }
                const mentorDTO = mentorDTO_1.MentorDTO.single(result);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    result: mentorDTO,
                    categories: categoryData,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //mentor refresh token
    mentorRefreshToken(refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!refresh) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.UNAUTHORIZED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                const decode = (0, jwt_utils_1.verifyRefreshToken)(refresh, "mentor");
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
                const accessToken = (0, jwt_utils_1.genAccesssToken)(userId, "mentor");
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(userId, "mentor");
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
    //mentor password change logic
    passwordChange(currentPassword, newPassword, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!currentPassword || !newPassword || !id) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                if (currentPassword == newPassword) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.NEW_PASS_REQUIRED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._mentorRepository.findMentorById(id);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NotFound,
                    };
                }
                const passCompare = yield bcrypt_1.default.compare(currentPassword, `${result === null || result === void 0 ? void 0 : result.password}`);
                if (!passCompare) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.PASSWORD_INCORRECT,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const hashedPassword = yield (0, hashPass_util_1.default)(newPassword);
                const response = yield this._mentorRepository.changeMentorPassword(id, hashedPassword);
                if (!response) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.FAILED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
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
    //metnor profile image change
    mentorProfileImageChange(image, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!image || !id) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                const profileUrl = yield (0, cloudinary_util_1.uploadImage)(image === null || image === void 0 ? void 0 : image.buffer);
                if (!profileUrl) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.FAILED,
                        status: httpStatusCode_1.Status.InternalServerError,
                    };
                }
                const result = yield this._mentorRepository.changeMentorProfileImage(profileUrl, id);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND,
                        status: httpStatusCode_1.Status.NotFound,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.PROFILE_PICTURE_CHANGED,
                    status: httpStatusCode_1.Status.Ok,
                    profileUrl: result.profileUrl,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    mentorEditProfile(mentorData, resume) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, name, email, phone, jobTitle, category, linkedinUrl, githubUrl, bio, skills, } = mentorData;
                if (!name ||
                    !email ||
                    !jobTitle ||
                    !category ||
                    !linkedinUrl ||
                    !githubUrl ||
                    !bio ||
                    !skills) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        result: null,
                    };
                }
                const existingMentor = yield this._mentorRepository.findMentorById(`${_id}`);
                if (!existingMentor) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NotFound,
                        result: null,
                    };
                }
                const updatedData = {};
                if (existingMentor)
                    updatedData.skills = skills;
                if (existingMentor._id)
                    updatedData._id = existingMentor._id;
                if (existingMentor.name !== name)
                    updatedData.name = name;
                if (existingMentor.email !== email)
                    updatedData.email = email;
                if (existingMentor.phone !== phone)
                    updatedData.phone = phone;
                if (existingMentor.jobTitle !== jobTitle)
                    updatedData.jobTitle = jobTitle;
                if (existingMentor.category !== category)
                    updatedData.category = category;
                if (existingMentor.linkedinUrl !== linkedinUrl)
                    updatedData.linkedinUrl = linkedinUrl;
                if (existingMentor.githubUrl !== githubUrl)
                    updatedData.githubUrl = githubUrl;
                if (existingMentor.bio !== bio)
                    updatedData.bio = bio;
                if (resume) {
                    const fileUrl = yield (0, cloudinary_util_1.uploadFile)(resume.buffer, resume.originalname);
                    if (!fileUrl) {
                        throw new Error("Error while uploading resume");
                    }
                    updatedData.resume = fileUrl;
                }
                else {
                    updatedData.resume = existingMentor.resume;
                }
                const result = yield this._mentorRepository.updateMentorById(updatedData);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.FAILED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NotFound,
                        result: null,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    result: result,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    questionData(filter, search, sortField, sortOrder, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!filter || page < 1 || limit < 1 || !sortField || !sortOrder) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        homeData: [],
                        totalPage: 0,
                    };
                }
                const pageNo = page || 1;
                const limitNo = limit || 6;
                const skip = (pageNo - 1) * limitNo;
                const response = yield this._questionRepository.allQuestionData(filter, search, sortOrder, sortField, skip, limit);
                const totalPage = Math.ceil((response === null || response === void 0 ? void 0 : response.count) / limitNo);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    homeData: response === null || response === void 0 ? void 0 : response.question,
                    totalPage,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    createTimeSlots(type, schedule, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = [];
                const timeSlotsToInsert = [];
                if (type === "recurring") {
                    const { endDate, price, selectedDays, startDate, slots } = schedule;
                    if (!type ||
                        !price ||
                        !startDate ||
                        slots.length === 0 ||
                        !endDate ||
                        (selectedDays === null || selectedDays === void 0 ? void 0 : selectedDays.length) == 0) {
                        return {
                            success: false,
                            message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                            status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                            timeSlots: [],
                        };
                    }
                    const checkedSlots = yield this._timeSlotRepository.checkTimeSlots(mentorId, new Date(startDate), new Date(endDate));
                    const res = (0, reusable_util_1.checkForOverlap)(checkedSlots, slots);
                    const today = new Date();
                    const startDateStr = new Date(startDate);
                    const endDateStr = new Date(endDate);
                    if (startDateStr < today) {
                        return {
                            success: false,
                            message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.START_DATE_CANNOT_BE_PAST,
                            status: httpStatusCode_1.Status.Ok,
                            timeSlots: [],
                        };
                    }
                    // Ensure endDate is after startDate
                    if (endDateStr.getTime() <= startDateStr.getTime()) {
                        return {
                            success: false,
                            message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DURATION_DIFFERNT_REQUIRED,
                            status: httpStatusCode_1.Status.Ok,
                            timeSlots: [],
                        };
                    }
                    const dayMap = {
                        Monday: rrule_1.RRule.MO,
                        Tuesday: rrule_1.RRule.TU,
                        Wednesday: rrule_1.RRule.WE,
                        Thursday: rrule_1.RRule.TH,
                        Friday: rrule_1.RRule.FR,
                        Saturday: rrule_1.RRule.SA,
                        Sunday: rrule_1.RRule.SU,
                    };
                    const byWeekdays = selectedDays.map((day) => dayMap[day]);
                    const rrule = new rrule_1.RRule({
                        freq: rrule_1.RRule.WEEKLY,
                        dtstart: new Date(startDate),
                        until: new Date(endDate !== null && endDate !== void 0 ? endDate : ""),
                        byweekday: byWeekdays,
                        interval: 1,
                    });
                    const recurringDates = rrule.all();
                    recurringDates.forEach((date) => {
                        res.forEach((slot) => {
                            const dateStr = date.toISOString();
                            const start = (0, moment_1.default)(`${dateStr.split("T")[0]} ${slot === null || slot === void 0 ? void 0 : slot.startTime}`, "YYYY-MM-DD HH:mm:ss");
                            const end = (0, moment_1.default)(`${dateStr.split("T")[0]} ${slot === null || slot === void 0 ? void 0 : slot.endTime}`, "YYYY-MM-DD HH:mm:ss");
                            const duration = moment_1.default.duration(end.diff(start));
                            const minutesDifference = duration.asMinutes();
                            if (minutesDifference < 30 || minutesDifference > 60) {
                                return {
                                    success: false,
                                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DURATION_DIFFERNT_REQUIRED,
                                    status: httpStatusCode_1.Status.Ok,
                                    timeSlots: [],
                                };
                            }
                            if (end.isBefore(start)) {
                                return {
                                    success: false,
                                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.END_TIME_PAST,
                                    status: httpStatusCode_1.Status.Ok,
                                    timeSlots: [],
                                };
                            }
                            const startStr = start.format("YYYY-MM-DDTHH:mm:ss");
                            const endStr = end.format("YYYY-MM-DDTHH:mm:ss");
                            const timeSlot = {
                                startDate: date,
                                slots: [
                                    {
                                        startTime: startStr,
                                        endTime: endStr,
                                    },
                                ],
                                price,
                                mentorId,
                                duration: minutesDifference,
                            };
                            timeSlotsToInsert.push(timeSlot);
                        });
                    });
                }
                else {
                    for (const entry of schedule) {
                        const { slots, price, startDate } = entry;
                        if (!price || !startDate || !mentorId) {
                            return {
                                success: false,
                                message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                                status: httpStatusCode_1.Status.BadRequest,
                                timeSlots: [],
                            };
                        }
                        const checkedSlots = yield this._timeSlotRepository.checkTimeSlots(mentorId, new Date(`${startDate}T00:00:00.000Z`), new Date(`${startDate}T23:59:59.999Z`));
                        const res = (0, reusable_util_1.checkForOverlap)(checkedSlots, slots);
                        const givenDate = (0, moment_1.default)(startDate, "YYYY-MM-DD");
                        const currentDate = (0, moment_1.default)().startOf("day");
                        if (givenDate.isBefore(currentDate)) {
                            return {
                                success: false,
                                message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATE_CANNOT_BE_PAST,
                                status: httpStatusCode_1.Status.BadRequest,
                                timeSlots: [],
                            };
                        }
                        const entrySlots = res.map((slot) => {
                            const start = (0, moment_1.default)(`${startDate} ${slot === null || slot === void 0 ? void 0 : slot.startTime}`, "YYYY-MM-DD HH:mm:ss");
                            const end = (0, moment_1.default)(`${startDate} ${slot === null || slot === void 0 ? void 0 : slot.endTime}`, "YYYY-MM-DD HH:mm:ss");
                            const duration = moment_1.default.duration(end.diff(start));
                            if (!duration) {
                                return {
                                    success: false,
                                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.TIME_DIFF_REQUIRED,
                                    status: httpStatusCode_1.Status.BadRequest,
                                    timeSlots: [],
                                };
                            }
                            const minutesDifference = duration.asMinutes();
                            if (minutesDifference < 30 || minutesDifference > 60) {
                                return {
                                    success: false,
                                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DURATION_DIFFERNT_REQUIRED,
                                    status: httpStatusCode_1.Status.Ok,
                                    timeSlots: [],
                                };
                            }
                            if (end.isBefore(start)) {
                                return {
                                    success: false,
                                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.END_TIME_PAST,
                                    status: httpStatusCode_1.Status.Ok,
                                    timeSlots: [],
                                };
                            }
                            // Create a date string in ISO format
                            const startStr = start.format("YYYY-MM-DDTHH:mm:ss");
                            const endStr = end.format("YYYY-MM-DDTHH:mm:ss");
                            const startDateInDate = new Date(startDate);
                            return {
                                startDate: startDateInDate,
                                slots: [
                                    {
                                        startTime: startStr,
                                        endTime: endStr,
                                    },
                                ],
                                price,
                                mentorId,
                                duration: minutesDifference,
                            };
                        });
                        timeSlotsToInsert.push(...entrySlots);
                    }
                }
                if (timeSlotsToInsert.length === 0) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.NO_SLOT_AVAIL_TO_CREATE,
                        status: httpStatusCode_1.Status.Ok,
                        timeSlots: [],
                    };
                }
                result = yield this._timeSlotRepository.createTimeSlot(timeSlotsToInsert);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.FAILED,
                        status: httpStatusCode_1.Status.BadRequest,
                        timeSlots: [],
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SLOTS_CREATED,
                    status: httpStatusCode_1.Status.Ok,
                    timeSlots: result,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    getTimeSlots(mentorId, limit, page, search, filter, sortField, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mentorId ||
                    !filter ||
                    !sortField ||
                    !sortOrder ||
                    limit < 1 ||
                    page < 1) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        timeSlots: [],
                        totalPage: 0,
                    };
                }
                const skipData = (0, reusable_util_1.createSkip)(page, limit);
                const limitNo = skipData === null || skipData === void 0 ? void 0 : skipData.limitNo;
                const skip = skipData === null || skipData === void 0 ? void 0 : skipData.skip;
                const response = yield this._timeSlotRepository.getTimeSlots(mentorId, limitNo, skip, search, filter, sortField, sortOrder);
                const totalPage = Math.ceil((response === null || response === void 0 ? void 0 : response.totalDocs) / limitNo);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    status: httpStatusCode_1.Status.Ok,
                    timeSlots: response === null || response === void 0 ? void 0 : response.timeSlots,
                    totalPage,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    removeTimeSlot(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!slotId) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._timeSlotRepository.removeTimeSlot(slotId);
                if (!(result === null || result === void 0 ? void 0 : result.acknowledged) || result.deletedCount === 0) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.FAILED,
                        status: httpStatusCode_1.Status.NotFound,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    mentorChartData(mentorId, timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!timeRange) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        result: null,
                    };
                }
                const result = yield this._slotScheduleRepository.mentorChartData(mentorId, timeRange);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status.Ok,
                    result: result === null || result === void 0 ? void 0 : result.mentorChart,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.mentorService = mentorService;
