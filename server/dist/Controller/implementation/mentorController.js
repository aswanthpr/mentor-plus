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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorController = void 0;
const httpStatusCode_1 = require("../../Constants/httpStatusCode");
const index_1 = require("../../Utils/index");
class mentorController {
    constructor(_mentorService) {
        this._mentorService = _mentorService;
    }
    mentorLogout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res
                    .status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok)
                    .clearCookie("refreshToken", { httpOnly: true })
                    .json({ success: true, message: "Logged out successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    mentorProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                const { result, categories, success, message, status } = yield this._mentorService.mentorProfile(token);
                res.status(status).json({
                    success,
                    message,
                    result,
                    categories,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //for creating new access token
    mentorRefreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this._mentorService.mentorRefreshToken((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken);
                (0, index_1.setCookie)(res, result === null || result === void 0 ? void 0 : result.refreshToken)
                    .status(result === null || result === void 0 ? void 0 : result.status)
                    .json({
                    success: result === null || result === void 0 ? void 0 : result.success,
                    message: result === null || result === void 0 ? void 0 : result.message,
                    accessToken: result === null || result === void 0 ? void 0 : result.accessToken,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //mentor password changing
    profilePasswordChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { currentPassword, newPassword, _id } = req.body;
                const result = yield this._mentorService.passwordChange(currentPassword, newPassword, _id);
                res.status(result === null || result === void 0 ? void 0 : result.status).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    //metnor profile image change
    mentorProfileImageChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const profileImage = req.files &&
                    req.files.profileImage
                    ? req.files
                        .profileImage[0]
                    : null;
                const result = yield this._mentorService.mentorProfileImageChange(profileImage, _id);
                res.status(result === null || result === void 0 ? void 0 : result.status).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    mentorEditProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resume = req.files &&
                    req.files.resume
                    ? req.files.resume[0]
                    : null;
                const mentorData = Object.assign({}, req.body);
                const { status, success, message, result } = yield this._mentorService.mentorEditProfile(mentorData, resume);
                res.status(status).json({ success, message, result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //fetch mentor home data
    // /mentor/home/:filter
    questionData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter } = req.params;
                const { search, page = 1, limit, sortOrder, sortField } = req.query;
                const { status, success, message, homeData, totalPage } = yield this._mentorService.questionData(filter, String(search), String(sortField), String(sortOrder), Number(page), Number(limit));
                const userId = req.user;
                res
                    .status(status)
                    .json({ success, message, homeData, userId, totalPage });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //create time slots in mentor side
    // /mentor/schedule/create-slots
    // get the scheule time in the req.body
    createTimeSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type, schedule } = req.body;
                const { success, status, message, timeSlots } = yield this._mentorService.createTimeSlots(type, schedule, req.user);
                res.status(status).json({ success, message, status, timeSlots });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //schedule getting data.  /schedule/get-time-slots
    getTimeSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, filter, sortField, sortOrder, page, limit } = req.query;
                const { success, status, message, timeSlots, totalPage } = yield this._mentorService.getTimeSlots(req.user, Number(limit), Number(page), String(search), String(filter), String(sortField), String(sortOrder));
                res
                    .status(status)
                    .json({ success, message, status, timeSlots, totalPage });
            }
            catch (error) {
                next(error);
            }
        });
    }
    removeTimeSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slotId } = req.body;
                const { status, success, message } = yield this._mentorService.removeTimeSlot(slotId);
                res.status(status).json({ message, success });
            }
            catch (error) {
                next(error);
            }
        });
    }
    chartData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { timeRange } = req.query;
                const { success, message, status, result } = yield this._mentorService.mentorChartData(req.user, String(timeRange));
                res.status(status).json({ message, success, result });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.mentorController = mentorController;
