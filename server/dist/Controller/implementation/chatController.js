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
exports.chatController = void 0;
class chatController {
    constructor(_chatService) {
        this._chatService = _chatService;
    }
    getChats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { result, message, status, success } = yield this._chatService.getChats(req.user, req.query.role);
                res.status(status).json({ result, message, success, userId: req === null || req === void 0 ? void 0 : req.user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // get user messages
    getUserMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId } = req.query;
                const { message, result, status, success } = yield this._chatService.getUserMessage(chatId);
                res.status(status).json({ message, result, success });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.chatController = chatController;
