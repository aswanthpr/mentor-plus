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
class chatService {
    constructor(_chatRespository) {
        this._chatRespository = _chatRespository;
    }
    getChats(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('userId', userId);
                if (!userId || !role) {
                    return {
                        success: false,
                        message: "credential not found",
                        status: httpStatusCode_1.Status.BadRequest,
                        result: [],
                    };
                }
                let result;
                if (role === 'mentee') {
                    result = yield this._chatRespository.getMenteechats(userId);
                }
                else {
                    result = yield this._chatRespository.getMentorchats(userId);
                }
                console.log(result, 'thsi is the result');
                return {
                    success: true,
                    message: "successfully retrieved",
                    status: httpStatusCode_1.Status.Ok,
                    result: result,
                };
            }
            catch (error) {
                throw new Error(`Failed to send otp to mail1${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //get specific User chat
    getUserMessage(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!chatId) {
                    return {
                        success: false,
                        status: httpStatusCode_1.Status.BadRequest,
                        message: "credential not found",
                        result: []
                    };
                }
                const result = yield this._chatRespository.getUserMessage(chatId);
                if (!result) {
                    return {
                        success: false,
                        status: httpStatusCode_1.Status.NotFound,
                        message: "no result",
                        result: []
                    };
                }
                console.log(result, 'result messages');
                return {
                    success: true,
                    status: httpStatusCode_1.Status.Ok,
                    message: "success",
                    result: result
                };
            }
            catch (error) {
                throw new Error(`error while get all user message in service${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = chatService;
