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
const httpStatusCode_1 = require("../../Constants/httpStatusCode");
const mongoose_1 = __importDefault(require("mongoose"));
const httpResponse_1 = require("../../Constants/httpResponse");
const index_1 = require("../../Utils/index");
class reviewService {
    constructor(__reviewRepository) {
        this.__reviewRepository = __reviewRepository;
    }
    reviewNdRateMentor(rating, review, sessionId, menteeId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!review || !rating || !sessionId || !menteeId || !mentorId) {
                    return {
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        success: false,
                        feedback: null,
                    };
                }
                const mentor_Id = new mongoose_1.default.Types.ObjectId(mentorId);
                const mentee_Id = new mongoose_1.default.Types.ObjectId(menteeId);
                const session_Id = new mongoose_1.default.Types.ObjectId(sessionId);
                const response = yield this.__reviewRepository.findReivew(mentee_Id, mentor_Id);
                let updatedData = null;
                if (response) {
                    updatedData = yield ((_a = this.__reviewRepository) === null || _a === void 0 ? void 0 : _a.findReivewAndUpdate(mentee_Id, mentor_Id, review, rating, session_Id));
                }
                let result = null;
                if (!response) {
                    const newReviewRating = {
                        mentorId: mentor_Id,
                        menteeId: mentee_Id,
                        sessionId: session_Id,
                        rating,
                        feedback: review,
                    };
                    result = yield ((_b = this.__reviewRepository) === null || _b === void 0 ? void 0 : _b.reviewNdRateMentor(newReviewRating));
                    if (!result) {
                        return {
                            message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.REVIEW_NOT_CREATED,
                            status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NotFound,
                            success: false,
                            feedback: null,
                        };
                    }
                }
                return {
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.REVIEW_CREATED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    success: true,
                    feedback: result !== null && result !== void 0 ? result : updatedData,
                    oldReview: String(response === null || response === void 0 ? void 0 : response._id)
                };
            }
            catch (error) {
                throw new index_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.reviewService = reviewService;
