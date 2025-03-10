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
exports.reviewService = void 0;
const httpStatusCode_1 = require("../Utils/httpStatusCode");
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../index");
class reviewService {
    constructor(__reviewRepository, _notificationRepository) {
        this.__reviewRepository = __reviewRepository;
        this._notificationRepository = _notificationRepository;
    }
    reviewNdRateMentor(rating, review, sessionId, role, menteeId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!review || !sessionId || !role || !menteeId || !mentorId) {
                    return {
                        message: "credential not found",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        success: false,
                        feedback: null,
                    };
                }
                if (role == "mentee" && rating <= 0) {
                    return {
                        message: "rating cannot be zero",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        success: false,
                        feedback: null,
                    };
                }
                const mentor_Id = new mongoose_1.default.Types.ObjectId(mentorId);
                const mentee_Id = new mongoose_1.default.Types.ObjectId(menteeId);
                const session_Id = new mongoose_1.default.Types.ObjectId(sessionId);
                const newReviewRating = {
                    mentorId: mentor_Id,
                    menteeId: mentee_Id,
                    sessionId: session_Id,
                    rating,
                    feedback: review,
                    role,
                };
                const result = yield ((_a = this.__reviewRepository) === null || _a === void 0 ? void 0 : _a.reviewNdRateMentor(newReviewRating));
                if (!result) {
                    return {
                        message: "whoops... ,review not created",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NotFound,
                        success: false,
                        feedback: null,
                    };
                }
                const userId = role === "mentee" ? mentor_Id : mentee_Id;
                const userType = role === "mentee" ? "mentor" : "mentee";
                const message = role === "mentee"
                    ? `you got a ${rating} star rating `
                    : "you got a feedback from previous session ";
                const title = role === "mentee" ? "got a rating" : "got a feedback";
                const notif = yield this._notificationRepository.createNotification(userId, title, message, userType, `${process.env.CLIENT_ORIGIN_URL}/${role == "mentee" ? `mentee/bookings` : ""}`);
                if (notif) {
                    index_1.socketManager.sendNotification(String(userId), notif);
                }
                return {
                    message: "review created successfully",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    success: true,
                    feedback: result,
                };
            }
            catch (error) {
                throw new Error(`Error while rateMentor ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.reviewService = reviewService;
