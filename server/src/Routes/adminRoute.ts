import express, { Router } from "express";
import { adminService } from "../Service/adminService";
import categoryRepository from "../Repository/categoryRepository";
import { adminController } from "../Controller/adminController";
import menteeRepository from "../Repository/menteeRepository";
import mentorRepository from "../Repository/mentorRepository";
import qaService from "../Service/qaService";
import qaController from "../Controller/qaController";
import questionRepository from "../Repository/questionRepository";
import answerRepository from "../Repository/answerRepository";
import notificationRepository from "../Repository/notificationRepository";
import slotScheduleRepository from "../Repository/slotScheduleRepository";
import { notificationService } from "../Service/notificationService";
import { notificationController } from "../Controller/notificationController";
import authorizeUser from "../Middleware/authorizeUser"
const admin_Router: Router = express.Router();

const _adminService = new adminService(
  categoryRepository,
  menteeRepository,
  mentorRepository,
  notificationRepository,
  slotScheduleRepository,
);
const __notificationService = new notificationService(
  notificationRepository
)
const _adminController = new adminController(_adminService);
const __qaService = new qaService(
  questionRepository,
  answerRepository,
  notificationRepository
);
const __qaController = new qaController(__qaService);
const __notificationController = new notificationController(__notificationService)
//---------------------------------------------------------------------------------------------------------
admin_Router.post(
  "/logout",
  _adminController.adminLogout.bind(_adminController)
);
admin_Router.get(
  "/category_management",
  authorizeUser('admin'),
  _adminController.categoryData.bind(_adminController)
);
admin_Router.patch(
  "/edit_category",
  authorizeUser('admin'),
  _adminController.editCategory.bind(_adminController)
);
admin_Router.post(
  `/create_category`,
  authorizeUser('admin'),
  _adminController.createCategory.bind(_adminController)
);
admin_Router.put(
  `/change_category_status`,
  authorizeUser('admin'),
  _adminController.changeCategoryStatus.bind(_adminController)
);

admin_Router.get(
  `/mentee_management`,
  authorizeUser('admin'),
  _adminController.menteeData.bind(_adminController)
);
admin_Router.post(
  `/mentee_management/add_mentee`,
  _adminController.addMentee.bind(_adminController)
);
admin_Router.put(
  `/mentee_management/edit_mentee`,
  _adminController.editMentee.bind(_adminController)
);
admin_Router.patch(
  `/mentee_management/change_mentee_status`,
  authorizeUser('admin'),
  _adminController.changeMenteeStatus.bind(_adminController)
);

admin_Router.get(
  `/mentor_management`,
  authorizeUser('admin'),
  _adminController.mentorData.bind(_adminController)
);
admin_Router.patch(
  `/mentor_management/mentor_verify`,
  authorizeUser('admin'),
  _adminController.mentorVerify.bind(_adminController)
);
admin_Router.patch(
  `/mentor_management/change_mentor_status`,
  authorizeUser('admin'),
  _adminController.changeMentorStatus.bind(_adminController)
);
admin_Router.post(
  `/refresh-token`,
  _adminController.adminRefreshToken.bind(_adminController)
);
admin_Router.get(
  `/qa-management`,
  authorizeUser('admin'),
  __qaController.allQaData.bind(__qaController)
);
admin_Router.patch(
  `/qa_management/change_question_status`,
  authorizeUser('admin'),
  __qaController.blockQuestion.bind(__qaController)
);
admin_Router.patch(
  `/qa_management/change_answer_status`,
  authorizeUser('admin'),
  __qaController.blockAnswer.bind(__qaController)
);
admin_Router.get(`/dashboard`,authorizeUser('admin'),_adminController.getDashboardData.bind(_adminController));

admin_Router.get(
  `/notification`,
  authorizeUser('admin'),
  __notificationController.getNotification.bind(__notificationController)
);

admin_Router.patch(
  `/notification-read/:notificationId`,
  authorizeUser('admin'),
  __notificationController.markAsReadNotif.bind(__notificationController)
);
export default admin_Router;
