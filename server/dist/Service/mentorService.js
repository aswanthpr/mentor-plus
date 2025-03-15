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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const rrule_1 = require("rrule");
const jwt_utils_1 = require("../Utils/jwt.utils");
const hashPass_util_1 = __importDefault(require("../Utils/hashPass.util"));
const cloudinary_util_1 = require("../Config/cloudinary.util");
const httpStatusCode_1 = require("../Utils/httpStatusCode");
const moment_1 = __importDefault(require("moment"));
const reuseFunctions_1 = require("../Utils/reuseFunctions");
class mentorService {
    constructor(_mentorRepository, _categoryRepository, _questionRepository, _timeSlotRepository) {
        this._mentorRepository = _mentorRepository;
        this._categoryRepository = _categoryRepository;
        this._questionRepository = _questionRepository;
        this._timeSlotRepository = _timeSlotRepository;
    }
    mentorProfile(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const decode = jsonwebtoken_1.default.verify(token, (_a = process.env) === null || _a === void 0 ? void 0 : _a.JWT_ACCESS_SECRET);
                if (!decode) {
                    return {
                        success: false,
                        message: "Your session has expired. Please log in again.",
                        status: 403,
                        result: null,
                        categories: [],
                    };
                }
                const result = yield this._mentorRepository.findMentorById(decode === null || decode === void 0 ? void 0 : decode.userId);
                if (!result) {
                    return {
                        success: false,
                        message: "invalid credential",
                        status: 204,
                        result: null,
                        categories: [],
                    };
                }
                const categoryData = yield this._categoryRepository.categoryData();
                if (!categoryData) {
                    return {
                        success: false,
                        message: "invalid credential",
                        status: 204,
                        result: null,
                        categories: [],
                    };
                }
                return {
                    success: true,
                    message: "successfull",
                    status: 200,
                    result: result,
                    categories: categoryData,
                };
            }
            catch (error) {
                throw new Error(`Error while bl metneeProfile in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //mentor refresh token
    mentorRefreshToken(refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!refresh) {
                    return {
                        success: false,
                        message: "You are not authorized. Please log in.",
                        status: 401,
                    };
                }
                const decode = (0, jwt_utils_1.verifyRefreshToken)(refresh);
                if (!decode || !decode.userId) {
                    return {
                        success: false,
                        message: "You are not authorized. Please log in.",
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
                console.error("Error while generating BLRefreshToken", error);
                return {
                    success: false,
                    message: "An internal server error occurred. Please try again later.",
                    status: 500,
                };
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
                        message: "Please provide all required credentials.",
                        status: 400,
                    };
                }
                if (currentPassword == newPassword) {
                    return {
                        success: false,
                        message: "New password cannot be the same as the current password.",
                        status: 400,
                    };
                }
                const result = yield this._mentorRepository.findMentorById(id);
                if (!result) {
                    return {
                        success: false,
                        message: "User not found. Please check your credentials.",
                        status: 404,
                    };
                }
                const passCompare = yield bcrypt_1.default.compare(currentPassword, `${result === null || result === void 0 ? void 0 : result.password}`);
                if (!passCompare) {
                    return {
                        success: false,
                        message: "Incorrect current password. Please try again.",
                        status: 401,
                    };
                }
                const hashedPassword = yield (0, hashPass_util_1.default)(newPassword);
                const response = yield this._mentorRepository.changeMentorPassword(id, hashedPassword);
                if (!response) {
                    return {
                        success: false,
                        message: "Failed to update the password. Please try again later.",
                        status: 503,
                    };
                }
                return {
                    success: true,
                    message: "Password updated successfully.",
                    status: 200,
                };
            }
            catch (error) {
                throw new Error(`Error during password change${error instanceof Error ? error.message : String(error)}`);
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
                        message: "Image or ID is missing, please provide both.",
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                const profileUrl = yield (0, cloudinary_util_1.uploadImage)(image === null || image === void 0 ? void 0 : image.buffer);
                if (!profileUrl) {
                    return {
                        success: false,
                        message: "Failed to upload the image, please try again later.",
                        status: httpStatusCode_1.Status.InternalServerError,
                    };
                }
                // const currentPublicId = this.extractPublicIdFromCloudinaryUrl(currentProfile.profileUrl);
                // // If there's an existing image, delete it from Cloudinary
                // if (currentPublicId) {
                //   const deleteResult = await cloudinary.v2.uploader.destroy(currentPublicId);
                //   if (deleteResult.result !== 'ok') {
                //     return {
                //       success: false,
                //       message: "Failed to delete the old image from Cloudinary.",
                //       status: 500,
                //     };
                //   }
                // }
                const result = yield this._mentorRepository.changeMentorProfileImage(profileUrl, id);
                if (!result) {
                    return {
                        success: false,
                        message: "Mentor not found with the provided ID.",
                        status: httpStatusCode_1.Status.NotFound,
                    };
                }
                return {
                    success: true,
                    message: "Profile image updated successfully.",
                    status: httpStatusCode_1.Status.Ok,
                    profileUrl: result.profileUrl,
                };
            }
            catch (error) {
                throw new Error(`Error while bl metnee Profile  change in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    mentorEditProfile(mentorData, resume) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, name, email, phone, jobTitle, category, linkedinUrl, githubUrl, bio, skills, } = mentorData;
                console.log("\x1b[32m%s\x1b[0m", _id);
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
                        message: "credential is missing",
                        status: 400,
                        result: null,
                    };
                }
                const existingMentor = yield this._mentorRepository.findMentorById(`${_id}`);
                if (!existingMentor) {
                    return {
                        success: false,
                        message: "Mentor not existing",
                        status: 404,
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
                        message: "unable to update",
                        status: 404,
                        result: null,
                    };
                }
                return {
                    success: true,
                    message: "Details changed Successfully!",
                    status: 200,
                    result: result,
                };
            }
            catch (error) {
                throw new Error(`Error while  mentor Profile  edit details in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    homeData(filter, search, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(filter, search, page, limit);
                if (!filter || !page ||
                    !limit) {
                    return {
                        success: false,
                        message: "credentials not found",
                        status: 400,
                        homeData: [],
                        totalPage: 0
                    };
                }
                const pageNo = page || 1;
                const limitNo = limit || 6;
                const skip = (pageNo - 1) * limitNo;
                const response = yield this._questionRepository.allQuestionData(filter, search, skip, limit);
                const totalPage = Math.ceil((response === null || response === void 0 ? void 0 : response.count) / limitNo);
                return {
                    success: true,
                    message: "Data successfully fetched",
                    status: 200,
                    homeData: response === null || response === void 0 ? void 0 : response.question,
                    totalPage
                };
            }
            catch (error) {
                throw new Error(`Error while  mentor home data fetching in service: ${error instanceof Error ? error.message : String(error)}`);
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
                            message: "crdential not found",
                            status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                            timeSlots: [],
                        };
                    }
                    let res = [];
                    const checkedSlots = yield this._timeSlotRepository.checkTimeSlots(mentorId, new Date(startDate), new Date(endDate));
                    if (checkedSlots.length > 0) {
                        res = (0, reuseFunctions_1.checkForOverlap)(checkedSlots, slots);
                    }
                    if (res.length == 0) {
                        return {
                            success: false,
                            message: "all time periods are  duplicates ",
                            status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                            timeSlots: [],
                        };
                    }
                    const today = new Date();
                    const startDateStr = new Date(startDate);
                    const endDateStr = new Date(endDate);
                    if (startDateStr < today) {
                        return {
                            success: false,
                            message: "Start date cannot be in the past.",
                            status: httpStatusCode_1.Status.Ok,
                            timeSlots: [],
                        };
                    }
                    // Ensure endDate is after startDate
                    if (endDateStr.getTime() <= startDateStr.getTime()) {
                        return {
                            success: false,
                            message: "The time duration must be between 30 and 60 minutes.",
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
                        (res !== null && res !== void 0 ? res : slots).forEach((slot) => {
                            const dateStr = date.toISOString();
                            const start = (0, moment_1.default)(`${dateStr.split("T")[0]} ${slot === null || slot === void 0 ? void 0 : slot.startTime}`, "YYYY-MM-DD HH:mm:ss");
                            const end = (0, moment_1.default)(`${dateStr.split("T")[0]} ${slot === null || slot === void 0 ? void 0 : slot.endTime}`, "YYYY-MM-DD HH:mm:ss");
                            const duration = moment_1.default.duration(end.diff(start));
                            const minutesDifference = duration.asMinutes();
                            if (minutesDifference < 30 || minutesDifference > 60) {
                                return {
                                    success: false,
                                    message: "The time duration must be between 30 and 60 minutes.",
                                    status: httpStatusCode_1.Status.Ok,
                                    timeSlots: [],
                                };
                            }
                            if (end.isBefore(start)) {
                                return {
                                    success: false,
                                    message: "The End Time is Befor Start Time",
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
                    result = yield this._timeSlotRepository.createTimeSlot(timeSlotsToInsert);
                }
                else {
                    for (const entry of schedule) {
                        const { slots, price, startDate } = entry;
                        if (!price || !startDate || !mentorId) {
                            return {
                                success: false,
                                message: "credential missing",
                                status: httpStatusCode_1.Status.BadRequest,
                                timeSlots: [],
                            };
                        }
                        let res = [];
                        const checkedSlots = yield this._timeSlotRepository.checkTimeSlots(mentorId, new Date(`${startDate}T00:00:00.000Z`), new Date(`${startDate}T23:59:59.999Z`));
                        if (checkedSlots.length > 0) {
                            res = (0, reuseFunctions_1.checkForOverlap)(checkedSlots, slots);
                        }
                        if (res.length == 0) {
                            return {
                                success: false,
                                message: "all time periods are  duplicates ",
                                status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                                timeSlots: [],
                            };
                        }
                        const givenDate = (0, moment_1.default)(startDate, "YYYY-MM-DD");
                        const currentDate = (0, moment_1.default)().startOf("day");
                        if (givenDate.isBefore(currentDate)) {
                            return {
                                success: false,
                                message: " The given date is in the past.",
                                status: httpStatusCode_1.Status.BadRequest,
                                timeSlots: [],
                            };
                        }
                        const entrySlots = (res !== null && res !== void 0 ? res : slots).map((slot) => {
                            const start = (0, moment_1.default)(`${startDate} ${slot === null || slot === void 0 ? void 0 : slot.startTime}`, "YYYY-MM-DD HH:mm:ss");
                            const end = (0, moment_1.default)(`${startDate} ${slot === null || slot === void 0 ? void 0 : slot.endTime}`, "YYYY-MM-DD HH:mm:ss");
                            console.log(start, "11111111111111111111111111", end);
                            const duration = moment_1.default.duration(end.diff(start));
                            if (!duration) {
                                return {
                                    success: false,
                                    message: "Time difference is not in between 20 to 60.",
                                    status: httpStatusCode_1.Status.BadRequest,
                                    timeSlots: [],
                                };
                            }
                            const minutesDifference = duration.asMinutes();
                            console.log(start, "start", "end:", end, "minutesDifference:", minutesDifference);
                            if (minutesDifference < 30 || minutesDifference > 60) {
                                return {
                                    success: false,
                                    message: "The time duration must be between 30 and 60 minutes.",
                                    status: httpStatusCode_1.Status.Ok,
                                    timeSlots: [],
                                };
                            }
                            if (end.isBefore(start)) {
                                return {
                                    success: false,
                                    message: "The End Time is Befor Start Time",
                                    status: httpStatusCode_1.Status.Ok,
                                    timeSlots: [],
                                };
                            }
                            // Create a date string in ISO format
                            const startStr = start.format("YYYY-MM-DDTHH:mm:ss");
                            const endStr = end.format("YYYY-MM-DDTHH:mm:ss");
                            console.log(start.format("YYYY-MM-DDTHH:mm:ss"), end.format("YYYY-MM-DDTHH:mm:ss"), end.toISOString(), "this is the time i converted", startStr, endStr);
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
                result = yield this._timeSlotRepository.createTimeSlot(timeSlotsToInsert);
                console.log(result, "thsi is the result ");
                if (!result) {
                    return {
                        success: false,
                        message: "error while slot creating ",
                        status: httpStatusCode_1.Status.BadRequest,
                        timeSlots: [],
                    };
                }
                return {
                    success: true,
                    message: "slot created successfully",
                    status: httpStatusCode_1.Status.Ok,
                    timeSlots: result,
                };
            }
            catch (error) {
                throw new Error(`"\x1b[33m%s\x1b[0m",Error while mentor creating timeSlots in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    getTimeSlots(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mentorId) {
                    return {
                        success: false,
                        message: "credentials not found",
                        status: httpStatusCode_1.Status.BadRequest,
                        timeSlots: [],
                    };
                }
                const response = yield this._timeSlotRepository.getTimeSlots(mentorId);
                return {
                    success: true,
                    message: "Data successfully fetched",
                    status: httpStatusCode_1.Status.Ok,
                    timeSlots: response,
                };
            }
            catch (error) {
                throw new Error(`Error while  get time slots in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    removeTimeSlot(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!slotId) {
                    return {
                        success: false,
                        message: "credentials not found",
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._timeSlotRepository.removeTimeSlot(slotId);
                if (!(result === null || result === void 0 ? void 0 : result.acknowledged) || result.deletedCount === 0) {
                    return {
                        success: false,
                        message: "Slot not found or removal failed.",
                        status: httpStatusCode_1.Status.NotFound,
                    };
                }
                console.log(result, "result");
                return {
                    success: true,
                    message: "successfully removed",
                    status: httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new Error(`Error while  remove slots  in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.mentorService = mentorService;
