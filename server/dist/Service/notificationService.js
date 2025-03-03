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
exports.notificationService = void 0;
const httpStatusCode_1 = require("../Utils/httpStatusCode");
class notificationService {
    constructor(_notificationRepository) {
        this._notificationRepository = _notificationRepository;
    }
    getNotification(menteeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!menteeId) {
                    return {
                        success: false,
                        message: "credential not found",
                        status: httpStatusCode_1.Status.BadRequest,
                        result: null
                    };
                }
                const result = yield this._notificationRepository.getNotification(menteeId);
                if (!result) {
                    return {
                        success: false,
                        message: "Data not found",
                        status: httpStatusCode_1.Status.NotFound,
                        result: null
                    };
                }
                return {
                    success: true,
                    message: "successfully data retrieved",
                    status: httpStatusCode_1.Status.Ok,
                    result: result
                };
            }
            catch (error) {
                throw new Error(`error while getting notification ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    markAsReadNotification(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!notificationId || !userId) {
                    return {
                        success: false,
                        message: "credential not found",
                        status: httpStatusCode_1.Status.BadRequest
                    };
                }
                const result = yield this._notificationRepository.markAsRead(notificationId, userId);
                if (!result) {
                    return {
                        success: false,
                        message: "updation failed",
                        status: httpStatusCode_1.Status.NotFound
                    };
                }
                return {
                    success: true,
                    message: "successfully updated",
                    status: httpStatusCode_1.Status.Ok
                };
            }
            catch (error) {
                throw new Error(`error while marking  notification as read ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.notificationService = notificationService;
