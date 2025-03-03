"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const express_1 = __importDefault(require("express"));
const multer_util_1 = __importDefault(require("../Config/multer.util"));
const qaService_1 = __importDefault(require("../Service/qaService"));
const qaController_1 = __importDefault(require("../Controller/qaController"));
const menteeService_1 = require("../Service/menteeService");
const menteeAuthorization_1 = __importDefault(require("../Middleware/menteeAuthorization"));
const bookingService_1 = require("../Service/bookingService");
const menteeRepository_1 = __importDefault(require("../Repository/menteeRepository"));
const mentorRepository_1 = __importDefault(require("../Repository/mentorRepository"));
const answerRepository_1 = __importDefault(require("../Repository/answerRepository"));
const menteeController_1 = require("../Controller/menteeController");
const categoryRepository_1 = __importDefault(require("../Repository/categoryRepository"));
const questionRepository_1 = __importDefault(require("../Repository/questionRepository"));
const timeSlotRepository_1 = __importDefault(require("../Repository/timeSlotRepository"));
const bookingController_1 = require("../Controller/bookingController");
const notificationService_1 = require("../Service/notificationService");
const notificationRepository_1 = __importDefault(require("../Repository/notificationRepository"));
const slotScheduleRepository_1 = __importDefault(require("../Repository/slotScheduleRepository"));
const notificationController_1 = require("../Controller/notificationController");
const chatService_1 = __importDefault(require("../Service/chatService"));
const chatRepository_1 = __importDefault(require("../Repository/chatRepository"));
const chatController_1 = require("../Controller/chatController");
const __menteeService = new menteeService_1.menteeService(menteeRepository_1.default, mentorRepository_1.default, categoryRepository_1.default, questionRepository_1.default);
const __qaService = new qaService_1.default(questionRepository_1.default, answerRepository_1.default, notificationRepository_1.default);
const __bookingService = new bookingService_1.bookingService(timeSlotRepository_1.default, slotScheduleRepository_1.default, notificationRepository_1.default, chatRepository_1.default, new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
    maxNetworkRetries: 4,
}));
const __notificationService = new notificationService_1.notificationService(notificationRepository_1.default);
const __chatService = new chatService_1.default(chatRepository_1.default);
const __menteeController = new menteeController_1.menteeController(__menteeService);
const __qaController = new qaController_1.default(__qaService);
const __bookingController = new bookingController_1.bookingControlelr(__bookingService);
const __notificationController = new notificationController_1.notificationController(__notificationService);
const __chatController = new chatController_1.chatController(__chatService);
const mentee_Router = express_1.default.Router();
mentee_Router.post(`/refresh-token`, __menteeController.refreshToken.bind(__menteeController));
mentee_Router.post(`/logout`, __menteeController.menteeLogout.bind(__menteeController));
mentee_Router.get(`/explore`, menteeAuthorization_1.default, __menteeController.exploreData.bind(__menteeController));
mentee_Router.get(`/profile`, menteeAuthorization_1.default, __menteeController.menteeProfile.bind(__menteeController));
mentee_Router.put(`/profile/edit_profile`, menteeAuthorization_1.default, __menteeController.menteeProfileEdit.bind(__menteeController));
mentee_Router.patch(`/profile/change_password`, menteeAuthorization_1.default, __menteeController.passwordChange.bind(__menteeController));
mentee_Router.patch(`/profile/change_profile`, menteeAuthorization_1.default, multer_util_1.default.fields([{ name: "profileImage", maxCount: 1 }]), __menteeController.profileChange.bind(__menteeController));
mentee_Router.get(`/qa/:filter`, menteeAuthorization_1.default, __qaController.questionData.bind(__qaController));
mentee_Router.post(`/qa/add-question`, menteeAuthorization_1.default, __qaController.addQuestion.bind(__qaController));
mentee_Router.patch(`/qa/edit-question`, menteeAuthorization_1.default, __qaController.editQuestion.bind(__qaController));
mentee_Router.get(`/home/:filter`, menteeAuthorization_1.default, __menteeController.homeData.bind(__menteeController));
mentee_Router.delete(`/qa/delete/:questionId`, menteeAuthorization_1.default, __qaController.deleteQuestion.bind(__qaController));
mentee_Router.post(`/qa/create-answer`, menteeAuthorization_1.default, __qaController.createNewAnswer.bind(__qaController));
mentee_Router.patch(`/qa/edit-answer`, menteeAuthorization_1.default, __qaController.editAnswer.bind(__qaController));
mentee_Router.get(`/explore/similar-mentors`, menteeAuthorization_1.default, __menteeController.getSimilarMentors.bind(__menteeController));
mentee_Router.get(`/slot-booking`, menteeAuthorization_1.default, __bookingController.getTimeSlots.bind(__bookingController));
//slot book with rzorpay
mentee_Router.post(`/slot-booking`, menteeAuthorization_1.default, __bookingController.slotBooking.bind(__bookingController));
mentee_Router.post("/webhook", express_1.default.raw({ type: "application/json" }), __bookingController.stripeWebHook.bind(__bookingController));
// ./stripe listen --forward-to localhost:3000/mentee/webhook
mentee_Router.get(`/sessions`, menteeAuthorization_1.default, __bookingController.getBookedSlot.bind(__bookingController));
mentee_Router.patch(`/sessions/cancel_request/:sessionId`, menteeAuthorization_1.default, __bookingController.cancelSlot.bind(__bookingController));
mentee_Router.get(`/notification`, menteeAuthorization_1.default, __notificationController.getNotification.bind(__notificationController));
mentee_Router.patch(`/notification-read/:notificationId`, menteeAuthorization_1.default, __notificationController.markAsReadNotif.bind(__notificationController));
mentee_Router.get("/chats", menteeAuthorization_1.default, __chatController.getChats.bind(__chatController));
mentee_Router.get("/messages", menteeAuthorization_1.default, __chatController.getUserMessage.bind(__chatController));
exports.default = mentee_Router;
