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
class mentorController {
    constructor(_mentorService) {
        this._mentorService = _mentorService;
    }
    mentorLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res
                    .status(200)
                    .clearCookie("mentorToken", { httpOnly: true })
                    .json({ success: true, message: "Logged out successfully" });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "An internal server error occurred. Please try again later.",
                });
                throw new Error(`Error while mentee  logout ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    mentorProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                const { result, categories, success, message, status } = yield this._mentorService.mentorProfile(token);
                console.log(result, "...........................", req.user);
                res.status(status).json({
                    success,
                    message,
                    result,
                    categories,
                });
            }
            catch (error) {
                throw new Error(`Error while mentee  logout ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //for creating new access token
    mentorRefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this._mentorService.mentorRefreshToken((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.mentorToken);
                res
                    .status(result.status)
                    .cookie("mentorToken", result === null || result === void 0 ? void 0 : result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production" || false, //in development fasle
                    sameSite: "lax",
                    maxAge: 14 * 24 * 60 * 60 * 1000,
                })
                    .json({
                    success: result === null || result === void 0 ? void 0 : result.success,
                    message: result === null || result === void 0 ? void 0 : result.message,
                    accessToken: result === null || result === void 0 ? void 0 : result.accessToken,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "An internal server error occurred. Please try again later.",
                });
                throw new Error(`error while geting refreshToken${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //mentor password changing
    profilePasswordChange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "this is the password");
                const { currentPassword, newPassword, _id } = req.body;
                const result = yield this._mentorService.passwordChange(currentPassword, newPassword, _id);
                res.status(result === null || result === void 0 ? void 0 : result.status).json(result);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "An internal server error occurred. Please try again later.",
                });
                throw new Error(`error while profile password changing ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //metnor profile image change
    mentorProfileImageChange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const profileImage = req.files &&
                    req.files.profileImage
                    ? req.files
                        .profileImage[0]
                    : null;
                const result = yield this._mentorService.mentorProfileImageChange(profileImage, _id);
                res.status(result.status).json(result);
            }
            catch (error) {
                throw new Error(`error while mentor profile image change${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    mentorEditProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resume = req.files &&
                    req.files.resume
                    ? req.files.resume[0]
                    : null;
                console.log(resume, "this is resume", req.files);
                const mentorData = Object.assign({}, req.body);
                const { status, success, message, result } = yield this._mentorService.mentorEditProfile(mentorData, resume);
                res.status(status).json({ success, message, result });
            }
            catch (error) {
                throw new Error(`error while mentor profile Edit ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //fetch mentor home data
    // /mentor/home/:filter
    homeData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter } = req.params;
                const { status, success, message, homeData } = yield this._mentorService.homeData(filter);
                const userId = req.user;
                res.status(status).json({ success, message, homeData, userId });
            }
            catch (error) {
                throw new Error(`error while mentor profile Edit ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //create time slots in mentor side 
    // /mentor/schedule/create-slots
    // get the scheule time in the req.body
    createTimeSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type, schedule } = req.body;
                console.log(type, schedule, 'creaeSchedule');
                const { success, status, message, timeSlots } = yield this._mentorService.createTimeSlots(type, schedule, req.user);
                res.status(status).json({ success, message, status, timeSlots });
            }
            catch (error) {
                throw new Error(`error while mentor creating time slots  ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //schedule getting data.  /schedule/get-time-slots
    getTimeSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { success, status, message, timeSlots } = yield this._mentorService.getTimeSlots(req.user);
                res.status(status).json({ success, message, status, timeSlots });
            }
            catch (error) {
                throw new Error(`error while mentor getting time slots  ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    removeTimeSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slotId } = req.body;
                console.log(slotId, 'ths is slot id');
                const { status, success, message } = yield this._mentorService.removeTimeSlot(slotId);
                res.status(status).json({ message, success });
            }
            catch (error) {
                throw new Error(`error while mentor getting time slots  ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.mentorController = mentorController;
