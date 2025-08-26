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
const baseRepo_1 = require("../baseRepo");
const messageSchema_1 = __importDefault(require("../../Model/messageSchema"));
const http_error_handler_util_1 = require("../../Utils/http-error-handler.util");
const httpStatusCode_1 = require("../../Constants/httpStatusCode");
class messageRepository extends baseRepo_1.baseRepository {
    constructor() {
        super(messageSchema_1.default);
    }
    getMessage(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.aggregateData(messageSchema_1.default, [
                    {
                        $match: {
                            chatId,
                        },
                    },
                    {
                        $sort: {
                            createdAt: 1,
                        },
                    },
                ]);
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    createMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.createDocument({
                    chatId: data === null || data === void 0 ? void 0 : data.chatId,
                    senderId: data === null || data === void 0 ? void 0 : data.senderId,
                    receiverId: data === null || data === void 0 ? void 0 : data.receiverId,
                    senderType: data === null || data === void 0 ? void 0 : data.senderType,
                    content: data === null || data === void 0 ? void 0 : data.content,
                    messageType: data === null || data === void 0 ? void 0 : data.messageType,
                });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.default = new messageRepository();
