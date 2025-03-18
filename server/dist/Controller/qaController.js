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
    addQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user;
                const { message, success, status, question } = yield this._qaService.addQuestionService(req.body, userId);
                res.status(status).json({ success, message, question });
            }
            catch (error) {
                console.log(error instanceof Error ? error.message : String(error));
            }
        });
    }
    questionData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter } = req.params;
                const { success, message, question, status, userId } = yield this._qaService.questionData(req.user, filter);
                res.status(status).json({ message, success, status, question, userId });
            }
            catch (error) {
                console.log(error instanceof Error ? error.message : String(error));
            }
        });
    }
    //edit question from mentee home && qa
    editQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionId, updatedQuestion, filter } = req.body;
                const { status, message, success, question } = yield this._qaService.editQuestion(questionId, updatedQuestion, filter);
                console.log(question);
                res.status(status).json({ success, message, question: question[0] });
            }
            catch (error) {
                console.log("error while editing question", error instanceof Error ? error.message : String(error));
            }
        });
    }
    createNewAnswer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { answer, questionId, userType } = req.body;
                const questId = new mongoose_1.default.Types.ObjectId(questionId);
                const { status, success, message, answers } = yield this._qaService.createNewAnswer(answer, questId, req.user, userType);
                res.status(status).json({ success, message, answers });
            }
            catch (error) {
                throw new Error(`error while creating new Answer ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //edit answer in mentee
    editAnswer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { answerId, content } = req.body;
                const { status, message, success, answer } = yield this._qaService.editAnswer(content, answerId);
                res.status(status).json({ success, message, answer });
            }
            catch (error) {
                throw new Error(`error while edit Answer ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    deleteQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionId } = req.params;
                const { status, success, message } = yield this._qaService.deleteQuestion(questionId);
                res.status(status).json({ success, message });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`Error while delete questions ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    allQaData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search = "", Status = "all", sortField = "createdAt", sortOrder = "desc", page = 1, limit = 8, } = req.query;
                const { message, success, status, questions, totalPage } = yield this._qaService.allQaData(String(search), String(Status), String(sortField), String(sortOrder), Number(page), Number(limit));
                res
                    .status(status)
                    .json({ message, status, success, questions, totalPage });
            }
            catch (error) {
                throw new Error(`Error while getting all QA data ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //qa status change admin
    // /admin/qa-management/change-question-status
    blockQuestion(req, res) {
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
                throw new Error(`error while edit qa status ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    blockAnswer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this._qaService.changeAnswerStatus((_a = req.body) === null || _a === void 0 ? void 0 : _a.answerId);
                console.log(result.result);
                res
                    .status(result.status)
                    .json({
                    success: result === null || result === void 0 ? void 0 : result.success,
                    message: result === null || result === void 0 ? void 0 : result.message,
                    result: result === null || result === void 0 ? void 0 : result.result,
                });
            }
            catch (error) {
                throw new Error(`error while edit answer status ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = qaController;
