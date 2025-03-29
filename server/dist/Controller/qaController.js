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
const mongoose_1 = __importDefault(require("mongoose"));
class qaController {
    constructor(_qaService) {
        this._qaService = _qaService;
    }
    addQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user;
                const { message, success, status, question } = yield this._qaService.addQuestionService(req.body, userId);
                res.status(status).json({ success, message, question });
            }
            catch (error) {
                next(error);
            }
        });
    }
    questionData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter, search, limit, page, sortField, sortOrder } = req.query;
                const { success, message, question, status, userId } = yield this._qaService.questionData(req.user, String(filter), String(search), String(sortField), String(sortOrder), Number(limit), Number(page));
                res.status(status).json({ message, success, status, question, userId });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //edit question from mentee home && qa
    editQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionId, updatedQuestion, filter } = req.body;
                const { status, message, success, question } = yield this._qaService.editQuestion(questionId, updatedQuestion, filter);
                res.status(status).json({ success, message, question: question[0] });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createNewAnswer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { answer, questionId, userType } = req.body;
                const questId = new mongoose_1.default.Types.ObjectId(questionId);
                const { status, success, message, answers } = yield this._qaService.createNewAnswer(answer, questId, req.user, userType);
                res.status(status).json({ success, message, answers });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //edit answer in mentee
    editAnswer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { answerId, content } = req.body;
                const { status, message, success, answer } = yield this._qaService.editAnswer(content, answerId);
                res.status(status).json({ success, message, answer });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionId } = req.params;
                const { status, success, message } = yield this._qaService.deleteQuestion(questionId);
                res.status(status).json({ success, message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    allQaData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search = "", Status = "all", sortField = "createdAt", sortOrder = "desc", page = 1, limit = 8, } = req.query;
                const { message, success, status, questions, totalPage } = yield this._qaService.allQaData(String(search), String(Status), String(sortField), String(sortOrder), Number(page), Number(limit));
                res
                    .status(status)
                    .json({ message, status, success, questions, totalPage });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //qa status change admin
    // /admin/qa-management/change-question-status
    blockQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this._qaService.changeQuestionStatus((_a = req.body) === null || _a === void 0 ? void 0 : _a.questionId);
                res
                    .status(result.status)
                    .json({
                    success: result === null || result === void 0 ? void 0 : result.success,
                    message: result === null || result === void 0 ? void 0 : result.message,
                    result: result === null || result === void 0 ? void 0 : result.result,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    blockAnswer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this._qaService.changeAnswerStatus((_a = req.body) === null || _a === void 0 ? void 0 : _a.answerId);
                res
                    .status(result.status)
                    .json({
                    success: result === null || result === void 0 ? void 0 : result.success,
                    message: result === null || result === void 0 ? void 0 : result.message,
                    result: result === null || result === void 0 ? void 0 : result.result,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = qaController;
