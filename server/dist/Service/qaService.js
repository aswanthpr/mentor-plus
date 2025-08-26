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
const httpStatusCode_1 = require("../Constants/httpStatusCode");
const index_1 = require("../index");
const httpResponse_1 = require("../Constants/httpResponse");
const index_2 = require("../Utils/index");
class qaService {
    constructor(__questionRepository, __answerRepository, __notificationRepository) {
        this.__questionRepository = __questionRepository;
        this.__answerRepository = __answerRepository;
        this.__notificationRepository = __notificationRepository;
    }
    addQuestionService(Data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, content, tags } = Data;
                if (!title ||
                    !content ||
                    !Array.isArray(tags) ||
                    !userId) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        question: undefined,
                    };
                }
                const result = yield this.__questionRepository.isQuestionExist(title, content);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.QUESTION_EXIST,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Conflict,
                        question: undefined,
                    };
                }
                const response = yield this.__questionRepository.createQuestion(title, content, tags, userId);
                if (!response) {
                    return {
                        success: false,
                        message: "Unexpected error occured",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        question: undefined,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    question: response,
                };
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    questionData(userId, filter, search, sortField, sortOrder, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId || !filter || !sortField || !sortOrder || 1 > limit || 1 > page) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        question: [],
                        totalPage: 0,
                    };
                }
                const skipData = (0, index_2.createSkip)(page, limit);
                const limitNo = skipData === null || skipData === void 0 ? void 0 : skipData.limitNo;
                const skip = skipData === null || skipData === void 0 ? void 0 : skipData.skip;
                const response = yield this.__questionRepository.questionData(userId, filter, search, limitNo, skip, sortField, sortOrder);
                const totalPage = Math.ceil((response === null || response === void 0 ? void 0 : response.totalDocs) / limitNo);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    question: response === null || response === void 0 ? void 0 : response.questions,
                    userId,
                    totalPage
                };
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    editQuestion(questionId, updatedQuestion, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!questionId || !updatedQuestion || !filter) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        question: null,
                    };
                }
                const response = yield this.__questionRepository.editQuestions(questionId, updatedQuestion, filter);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    question: response,
                };
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    createNewAnswer(answer, questionId, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!answer || !questionId || !userId || !userType) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        answers: null,
                    };
                }
                const response = yield (this === null || this === void 0 ? void 0 : this.__answerRepository.createNewAnswer(answer, questionId, userId, userType));
                if (!(response === null || response === void 0 ? void 0 : response.menteeId) || !(response === null || response === void 0 ? void 0 : response.result)) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.NotFound,
                        answers: null,
                    };
                }
                if (userId !== (response === null || response === void 0 ? void 0 : response.menteeId)) {
                    const notif = yield this.__notificationRepository.createNotification(response === null || response === void 0 ? void 0 : response.menteeId, "You've Got a New Answer!", "Good news! you got replied to your question ", "mentee", `${process.env.CLIENT_ORIGIN_URL}/mentee/qa`);
                    const user_Id = String(response === null || response === void 0 ? void 0 : response.menteeId);
                    index_1.socketManager.sendNotification(user_Id, notif);
                }
                const questId = questionId;
                const result = yield this.__questionRepository.countAnswer(questId);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.FAILED,
                        status: httpStatusCode_1.Status.NotFound,
                        answers: null,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status.Ok,
                    answers: response === null || response === void 0 ? void 0 : response.result,
                };
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    editAnswer(content, answerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!answerId || !content) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        answer: null,
                    };
                }
                const result = yield this.__answerRepository.editAnswer(content, answerId);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.NotFound,
                        answer: null,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status.Ok,
                    answer: result === null || result === void 0 ? void 0 : result.answer,
                };
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    deleteQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate input
                if (!questionId) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                const response = yield this.__questionRepository.deleteQuestion(questionId);
                if (!response || response.deletedCount !== 1) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.NotFound,
                    };
                }
                //reducing the count of answers after delete the document
                yield this.__questionRepository.reduceAnswerCount(questionId);
                //Delete the quesiton with its answer
                yield this.__answerRepository.deleteAnswer(questionId);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    status: httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //this is for admin side qa-management
    // /admin/qa-management
    allQaData(search, status, sortField, sortOrder, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!status || !sortField || !sortOrder || page < 1 || limit < 1) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        questions: undefined,
                        totalPage: undefined,
                    };
                }
                const skipData = (0, index_2.createSkip)(page, limit);
                const limitNo = skipData === null || skipData === void 0 ? void 0 : skipData.limitNo;
                const skip = skipData === null || skipData === void 0 ? void 0 : skipData.skip;
                const response = yield this.__questionRepository.allQaData(skip, search, status, limitNo, sortOrder, sortField);
                const totalPage = Math.ceil((response === null || response === void 0 ? void 0 : response.docCount) / limitNo);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    status: httpStatusCode_1.Status.Ok,
                    questions: response === null || response === void 0 ? void 0 : response.questions,
                    totalPage,
                };
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    changeQuestionStatus(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!questionId) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this.__questionRepository.changeQuestionStatus(questionId);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.NotFound,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status.Ok,
                    result: result === null || result === void 0 ? void 0 : result.isBlocked,
                };
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //answer status change in admin
    ///admin/qa-management/change-answer-status/
    changeAnswerStatus(answerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!answerId) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this.__answerRepository.changeAnswerStatus(answerId);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.NotFound,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status.Ok,
                    result: result === null || result === void 0 ? void 0 : result.isBlocked,
                };
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.default = qaService;
