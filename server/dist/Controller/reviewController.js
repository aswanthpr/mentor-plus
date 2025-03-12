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
exports.reviewController = void 0;
class reviewController {
    constructor(__reviewService) {
        this.__reviewService = __reviewService;
    }
    reviewNdRateMentor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rating, review, sessionId, menteeId, mentorId } = req.body;
                const { status, message, success, feedback, oldReview } = yield this.__reviewService.reviewNdRateMentor(rating, review, sessionId, menteeId, mentorId);
                res.status(status).json({ message, success, feedback, oldReview });
            }
            catch (error) {
                throw new Error(`Error while  webhook config ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.reviewController = reviewController;
