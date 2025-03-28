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
const reviewModel_1 = __importDefault(require("../Model/reviewModel"));
const baseRepo_1 = require("./baseRepo");
const httpStatusCode_1 = require("../Constants/httpStatusCode");
const http_error_handler_util_1 = require("../Utils/http-error-handler.util");
class reviewRepository extends baseRepo_1.baseRepository {
    constructor() {
        super(reviewModel_1.default);
    }
    reviewNdRateMentor(newReview) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.createDocument(newReview);
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    findReivewAndUpdate(menteeId, mentorId, feedback, rating, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.find_One_And_Update(reviewModel_1.default, { menteeId, mentorId }, { $set: { feedback, rating, sessionId } });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    findReivew(menteeId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.find_One({ menteeId, mentorId });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.default = new reviewRepository();
