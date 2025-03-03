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
exports.notificationController = void 0;
class notificationController {
    constructor(_notificationService) {
        this._notificationService = _notificationService;
    }
    getNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, message, success, result } = yield this._notificationService.getNotification(req.user);
                res.status(status).json({ success, message, result });
            }
            catch (error) {
                throw new Error(`error while getting notification ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    markAsReadNotif(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { notificationId } = req.params;
                const { message, status, success } = yield this._notificationService.markAsReadNotification(notificationId, req.user);
                res.status(status).json({ message, success });
            }
            catch (error) {
                throw new Error(`error while update  notification ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.notificationController = notificationController;
