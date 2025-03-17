"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminService_1 = require("../Service/adminService");
const categoryRepository_1 = __importDefault(require("../Repository/categoryRepository"));
const adminController_1 = require("../Controller/adminController");
const menteeRepository_1 = __importDefault(require("../Repository/menteeRepository"));
const mentorRepository_1 = __importDefault(require("../Repository/mentorRepository"));
const adminAuthMiddleware_1 = __importDefault(require("../Middleware/adminAuthMiddleware"));
const qaService_1 = __importDefault(require("../Service/qaService"));
const qaController_1 = __importDefault(require("../Controller/qaController"));
const questionRepository_1 = __importDefault(require("../Repository/questionRepository"));
const answerRepository_1 = __importDefault(require("../Repository/answerRepository"));
const notificationRepository_1 = __importDefault(require("../Repository/notificationRepository"));
const slotScheduleRepository_1 = __importDefault(require("../Repository/slotScheduleRepository"));
const notificationService_1 = require("../Service/notificationService");
const notificationController_1 = require("../Controller/notificationController");
const admin_Router = express_1.default.Router();
const _adminService = new adminService_1.adminService(categoryRepository_1.default, menteeRepository_1.default, mentorRepository_1.default, notificationRepository_1.default, slotScheduleRepository_1.default);
const __notificationService = new notificationService_1.notificationService(notificationRepository_1.default);
const _adminController = new adminController_1.adminController(_adminService);
const __qaService = new qaService_1.default(questionRepository_1.default, answerRepository_1.default, notificationRepository_1.default);
const __qaController = new qaController_1.default(__qaService);
const __notificationController = new notificationController_1.notificationController(__notificationService);
//---------------------------------------------------------------------------------------------------------
admin_Router.post("/logout", _adminController.adminLogout.bind(_adminController));
admin_Router.get("/category_management", adminAuthMiddleware_1.default, _adminController.categoryData.bind(_adminController));
admin_Router.patch("/edit_category", adminAuthMiddleware_1.default, _adminController.editCategory.bind(_adminController));
admin_Router.post(`/create_category`, adminAuthMiddleware_1.default, _adminController.createCategory.bind(_adminController));
admin_Router.put(`/change_category_status`, adminAuthMiddleware_1.default, _adminController.changeCategoryStatus.bind(_adminController));
admin_Router.get(`/mentee_management`, adminAuthMiddleware_1.default, _adminController.menteeData.bind(_adminController));
admin_Router.post(`/mentee_management/add_mentee`, _adminController.addMentee.bind(_adminController));
admin_Router.put(`/mentee_management/edit_mentee`, _adminController.editMentee.bind(_adminController));
admin_Router.patch(`/mentee_management/change_mentee_status`, adminAuthMiddleware_1.default, _adminController.changeMenteeStatus.bind(_adminController));
admin_Router.get(`/mentor_management`, adminAuthMiddleware_1.default, _adminController.mentorData.bind(_adminController));
admin_Router.patch(`/mentor_management/mentor_verify`, adminAuthMiddleware_1.default, _adminController.mentorVerify.bind(_adminController));
admin_Router.patch(`/mentor_management/change_mentor_status`, adminAuthMiddleware_1.default, _adminController.changeMentorStatus.bind(_adminController));
admin_Router.post(`/refresh-token`, _adminController.adminRefreshToken.bind(_adminController));
admin_Router.get(`/qa-management`, adminAuthMiddleware_1.default, __qaController.allQaData.bind(__qaController));
admin_Router.patch(`/qa_management/change_question_status`, adminAuthMiddleware_1.default, __qaController.blockQuestion.bind(__qaController));
admin_Router.patch(`/qa_management/change_answer_status`, adminAuthMiddleware_1.default, __qaController.blockAnswer.bind(__qaController));
admin_Router.get(`/dashboard`, adminAuthMiddleware_1.default, _adminController.getDashboardData.bind(_adminController));
admin_Router.get(`/notification`, adminAuthMiddleware_1.default, __notificationController.getNotification.bind(__notificationController));
admin_Router.patch(`/notification-read/:notificationId`, adminAuthMiddleware_1.default, __notificationController.markAsReadNotif.bind(__notificationController));
exports.default = admin_Router;
