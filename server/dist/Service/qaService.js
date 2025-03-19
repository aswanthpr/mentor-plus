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
const httpStatusCode_1 = require("../Utils/httpStatusCode");
const index_1 = require("../index");
const reusable_util_1 = require("../Utils/reusable.util");
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
                if (!Data ||
                    !Data.title ||
                    !Data.content ||
                    !Array.isArray(Data.tags) ||
                    !userId) {
                    return {
                        success: false,
                        message: "Invalid input: title, content, and tags are required",
                        status: 400,
                        question: undefined,
                    };
                }
                const result = yield this.__questionRepository.isQuestionExist(title, content);
                if (!result) {
                    return {
                        success: false,
                        message: "Question exist",
                        status: 400,
                        question: undefined,
                    };
                }
                const response = yield this.__questionRepository.createQuestion(title, content, tags, userId);
                if (!response) {
                    return {
                        success: false,
                        message: "Unexpected error occured",
                        status: 400,
                        question: undefined,
                    };
                }
                return {
                    success: true,
                    message: "Question created Successfully!",
                    status: 200,
                    question: response,
                };
            }
            catch (error) {
                throw new Error(`Error during creating question${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    questionData(userId, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId || !filter) {
                    return {
                        success: false,
                        message: "credential missing",
                        status: 400,
                        question: [],
                    };
                }
                const response = yield this.__questionRepository.questionData(userId, filter);
                return {
                    success: true,
                    message: "Data retrieved successfully",
                    status: 200,
                    question: response,
                    userId,
                };
            }
            catch (error) {
                throw new Error(`Error during get questions ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    editQuestion(questionId, updatedQuestion, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!questionId || !updatedQuestion || !filter) {
                    return {
                        success: false,
                        message: "Invalid input: title, content, and tags are required",
                        status: 400,
                        question: null,
                    };
                }
                const response = yield this.__questionRepository.editQuestions(questionId, updatedQuestion, filter);
                return {
                    success: true,
                    message: "Edit Successfully!",
                    status: 200,
                    question: response,
                };
            }
            catch (error) {
                throw new Error(`Error during edit questions ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    createNewAnswer(answer, questionId, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!answer || !questionId || !userId || !userType) {
                    return {
                        success: false,
                        message: "Credential missing",
                        status: httpStatusCode_1.Status.BadRequest,
                        answers: null,
                    };
                }
                const response = yield (this === null || this === void 0 ? void 0 : this.__answerRepository.createNewAnswer(answer, questionId, userId, userType));
                if (!(response === null || response === void 0 ? void 0 : response.menteeId) || !(response === null || response === void 0 ? void 0 : response.result)) {
                    return {
                        success: false,
                        message: "Answer not saved !unexpected error",
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
                console.log(response, "thsi is the respnose of answer tha tcreated me ", result);
                if (!result) {
                    return {
                        success: false,
                        message: "Unexpected Error ! answer not created",
                        status: httpStatusCode_1.Status.NotFound,
                        answers: null,
                    };
                }
                return {
                    success: true,
                    message: "Answer Created Successfully",
                    status: httpStatusCode_1.Status.Ok,
                    answers: response === null || response === void 0 ? void 0 : response.result,
                };
            }
            catch (error) {
                throw new Error(`Error during create answer ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    editAnswer(content, answerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!answerId || !content) {
                    return {
                        success: false,
                        message: "Credential missing",
                        status: httpStatusCode_1.Status.BadRequest,
                        answer: null,
                    };
                }
                const result = yield this.__answerRepository.editAnswer(content, answerId);
                console.log(result, "this is result");
                if (!result) {
                    return {
                        success: false,
                        message: "Data not found",
                        status: httpStatusCode_1.Status.NotFound,
                        answer: null,
                    };
                }
                return {
                    success: true,
                    message: "edited successfully",
                    status: httpStatusCode_1.Status.Ok,
                    answer: result === null || result === void 0 ? void 0 : result.answer,
                };
            }
            catch (error) {
                throw new Error(`Error during edit answer ${error instanceof Error ? error.message : String(error)}`);
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
                        message: "Question ID is required",
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                const response = yield this.__questionRepository.deleteQuestion(questionId);
                // Check if the deletion was successful
                if (!response || response.deletedCount !== 1) {
                    return {
                        success: false,
                        message: "Question not found or could not be deleted",
                        status: httpStatusCode_1.Status.NotFound,
                    };
                }
                //reducing the count of answers after delete the document
                yield this.__questionRepository.reduceAnswerCount(questionId);
                //Delete the quesiton with its answer
                yield this.__answerRepository.deleteAnswer(questionId);
                //returning the success response
                return {
                    success: true,
                    message: "Data successfully fetched",
                    status: httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                //console the error
                console.error(
                //using different color in terminal to show the error
                "\x1b[34m%s\x1b[0m", "Error while getting home data:", error instanceof Error ? error.message : String(error));
                //internal server error response
                return {
                    success: false,
                    message: "Internal server error",
                    status: httpStatusCode_1.Status.InternalServerError,
                };
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
                        message: "Invalid pagination or missing parameters",
                        status: httpStatusCode_1.Status.BadRequest,
                        questions: undefined,
                        totalPage: undefined,
                    };
                }
                const skipData = (0, reusable_util_1.createSkip)(page, limit);
                const limitNo = skipData === null || skipData === void 0 ? void 0 : skipData.limitNo;
                const skip = skipData === null || skipData === void 0 ? void 0 : skipData.skip;
                const response = yield this.__questionRepository.allQaData(skip, search, status, limitNo, sortOrder, sortField);
                const totalPage = Math.ceil((response === null || response === void 0 ? void 0 : response.docCount) / limitNo);
                console.log(response === null || response === void 0 ? void 0 : response.docCount, totalPage, limit, skip, page);
                return {
                    success: true,
                    message: "data fetched successfully",
                    status: httpStatusCode_1.Status.Ok,
                    questions: response === null || response === void 0 ? void 0 : response.questions,
                    totalPage,
                };
            }
            catch (error) {
                throw new Error(`Error during fetch all data to admin ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    changeQuestionStatus(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!questionId) {
                    return {
                        success: false,
                        message: "credential is missing",
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this.__questionRepository.changeQuestionStatus(questionId);
                if (!result) {
                    return {
                        success: false,
                        message: "Question not found",
                        status: httpStatusCode_1.Status.NotFound,
                    };
                }
                return {
                    success: true,
                    message: "Status changed successfully",
                    status: httpStatusCode_1.Status.Ok,
                    result: result === null || result === void 0 ? void 0 : result.isBlocked,
                };
            }
            catch (error) {
                throw new Error(`Error while change category status in service: ${error instanceof Error ? error.message : String(error)}`);
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
                        message: "credential is missing",
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this.__answerRepository.changeAnswerStatus(answerId);
                if (!result) {
                    return {
                        success: false,
                        message: "answer not found",
                        status: httpStatusCode_1.Status.NotFound,
                    };
                }
                return {
                    success: true,
                    message: "Status changed successfully",
                    status: httpStatusCode_1.Status.Ok,
                    result: result === null || result === void 0 ? void 0 : result.isBlocked,
                };
            }
            catch (error) {
                throw new Error(`Error while change answer status admin side: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = qaService;
