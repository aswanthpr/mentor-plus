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
const notificationModel_1 = __importDefault(require("../Model/notificationModel"));
const baseRepo_1 = require("./baseRepo");
class notificationRepository extends baseRepo_1.baseRepository {
    constructor() {
        super(notificationModel_1.default);
    }
    createNotification(userId, title, message, userType, url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createDocument({
                userId,
                title,
                message,
                userType,
                url
            });
        });
    }
    getNotification(menteeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.aggregateData(notificationModel_1.default, [
                    {
                        $match: {
                            userId: menteeId,
                            isRead: false
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    }
                ]);
            }
            catch (error) {
                throw new Error(`error while getting notification  ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    markAsRead(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.find_One_And_Update(notificationModel_1.default, { userId, _id: notificationId }, { $set: { isRead: true } });
            }
            catch (error) {
                throw new Error(`error while markas  notification  read ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = new notificationRepository();
