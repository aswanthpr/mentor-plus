"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_util_1 = __importDefault(require("../Config/multer.util"));
const mentorAuthMiddleware_1 = __importDefault(require("../Middleware/mentorAuthMiddleware"));
const qaController_1 = __importDefault(require("../Controller/qaController"));
const mentorController_1 = require("../Controller/mentorController");
const bookingController_1 = require("../Controller/bookingController");
const chatController_1 = require("../Controller/chatController");
const notificationController_1 = require("../Controller/notificationController");
const qaService_1 = __importDefault(require("../Service/qaService"));
const chatService_1 = __importDefault(require("../Service/chatService"));
const mentorService_1 = require("../Service/mentorService");
const bookingService_1 = require("../Service/bookingService");
const notificationService_1 = require("../Service/notificationService");
const chatRepository_1 = __importDefault(require("../Repository/chatRepository"));
const mentorRepository_1 = __importDefault(require("../Repository/mentorRepository"));
const answerRepository_1 = __importDefault(require("../Repository/answerRepository"));
const questionRepository_1 = __importDefault(require("../Repository/questionRepository"));
const categoryRepository_1 = __importDefault(require("../Repository/categoryRepository"));
const timeSlotRepository_1 = __importDefault(require("../Repository/timeSlotRepository"));
const slotScheduleRepository_1 = __importDefault(require("../Repository/slotScheduleRepository"));
const notificationRepository_1 = __importDefault(require("../Repository/notificationRepository"));
const walletRepository_1 = __importDefault(require("../Repository/walletRepository"));
const transactionRepository_1 = __importDefault(require("../Repository/transactionRepository"));
const walletController_1 = require("../Controller/walletController");
const walletService_1 = require("../Service/walletService");
const __mentorService = new mentorService_1.mentorService(mentorRepository_1.default, categoryRepository_1.default, questionRepository_1.default, timeSlotRepository_1.default, slotScheduleRepository_1.default);
const __chatService = new chatService_1.default(chatRepository_1.default);
const __qaService = new qaService_1.default(questionRepository_1.default, answerRepository_1.default, notificationRepository_1.default);
const __bookingService = new bookingService_1.bookingService(timeSlotRepository_1.default, slotScheduleRepository_1.default, notificationRepository_1.default, chatRepository_1.default, walletRepository_1.default, transactionRepository_1.default);
const __notificationService = new notificationService_1.notificationService(notificationRepository_1.default);
const __walletService = new walletService_1.walletService(walletRepository_1.default, transactionRepository_1.default, notificationRepository_1.default);
const __walletController = new walletController_1.walletController(__walletService);
const __mentorController = new mentorController_1.mentorController(__mentorService);
const __qaController = new qaController_1.default(__qaService);
const __bookingController = new bookingController_1.bookingControlelr(__bookingService);
const __notificationController = new notificationController_1.notificationController(__notificationService);
const __chatController = new chatController_1.chatController(__chatService);
const mentor_Router = express_1.default.Router();
mentor_Router.post(`/logout`, __mentorController.mentorLogout.bind(__mentorController));
//profile
mentor_Router.get(`/profile`, mentorAuthMiddleware_1.default, __mentorController.mentorProfile.bind(__mentorController));
mentor_Router.patch(`/profile/change_password`, mentorAuthMiddleware_1.default, __mentorController.profilePasswordChange.bind(__mentorController));
mentor_Router.post("/refresh-token", __mentorController.mentorRefreshToken.bind(__mentorController));
mentor_Router.patch(`/profile/image_change`, mentorAuthMiddleware_1.default, multer_util_1.default.fields([{ name: "profileImage", maxCount: 1 }]), __mentorController.mentorProfileImageChange.bind(__mentorController));
mentor_Router.put(`/profile/edit_profile_details`, multer_util_1.default.fields([{ name: "resume", maxCount: 1 }]), __mentorController.mentorEditProfile.bind(__mentorController));
mentor_Router.get(`/home/:filter`, mentorAuthMiddleware_1.default, __mentorController.homeData.bind(__mentorController));
mentor_Router.post(`/qa/create-new-answer`, mentorAuthMiddleware_1.default, __qaController.createNewAnswer.bind(__qaController));
mentor_Router.patch(`/qa/edit-answer`, mentorAuthMiddleware_1.default, __qaController.editAnswer.bind(__qaController));
//schedule
mentor_Router.post(`/schedule/create-slots`, mentorAuthMiddleware_1.default, __mentorController.createTimeSlots.bind(__mentorController));
mentor_Router.get(`/schedule/get-time-slots`, mentorAuthMiddleware_1.default, __mentorController.getTimeSlots.bind(__mentorController));
mentor_Router.delete(`/schedule/remove-time-slot`, mentorAuthMiddleware_1.default, __mentorController.removeTimeSlot.bind(__mentorController));
mentor_Router.get(`/sessions`, mentorAuthMiddleware_1.default, __bookingController.getBookedSession.bind(__bookingController));
mentor_Router.patch(`/sessions/cancel_request/:sessionId`, mentorAuthMiddleware_1.default, __bookingController.mentorSlotCancel.bind(__bookingController));
mentor_Router.patch(`/sessions/create-session-code`, mentorAuthMiddleware_1.default, __bookingController === null || __bookingController === void 0 ? void 0 : __bookingController.createSessionCode.bind(__bookingController));
mentor_Router.patch(`/sessions/mark-as-session-completed`, mentorAuthMiddleware_1.default, __bookingController.sessionCompleted.bind(__bookingController));
//notification
mentor_Router.get(`/notification`, mentorAuthMiddleware_1.default, __notificationController === null || __notificationController === void 0 ? void 0 : __notificationController.getNotification.bind(__notificationController));
mentor_Router.patch(`/notification-read/:notificationId`, mentorAuthMiddleware_1.default, __notificationController.markAsReadNotif.bind(__notificationController));
//chat
mentor_Router.get(`/chats`, mentorAuthMiddleware_1.default, __chatController.getChats.bind(__chatController));
mentor_Router.get("/messages", mentorAuthMiddleware_1.default, __chatController.getUserMessage.bind(__chatController));
mentor_Router.post("/session/validate-session-join", mentorAuthMiddleware_1.default, __bookingController.validateSessionJoin.bind(__bookingController));
//wallet'
mentor_Router.get(`/wallet`, mentorAuthMiddleware_1.default, __walletController.getWalletData.bind(__walletController));
mentor_Router.put(`/withdraw-amount`, mentorAuthMiddleware_1.default, __walletController.withdrawMentorEarnings.bind(__walletController));
mentor_Router.get(`/statistics`, mentorAuthMiddleware_1.default, __mentorController.chartData.bind(__mentorController));
exports.default = mentor_Router;
