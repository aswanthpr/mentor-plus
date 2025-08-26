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
const httpStatusCode_1 = require("../../Constants/httpStatusCode");
const httpResponse_1 = require("../../Constants/httpResponse");
const index_1 = require("../../Utils/index");
class chatService {
    constructor(_chatRespository) {
        this._chatRespository = _chatRespository;
    }
    getChats(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId || !role) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
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
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_FOUND,
                    status: httpStatusCode_1.Status.Ok,
                    result: result,
                };
            }
            catch (error) {
                throw new index_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
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
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        result: []
                    };
                }
                const result = yield this._chatRespository.getUserMessage(chatId);
                if (!result) {
                    return {
                        success: false,
                        status: httpStatusCode_1.Status.NotFound,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        result: []
                    };
                }
                return {
                    success: true,
                    status: httpStatusCode_1.Status.Ok,
                    message: "success",
                    result: result
                };
            }
            catch (error) {
                throw new index_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.default = chatService;
