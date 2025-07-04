import express, { Router } from "express";
import upload from "../Config/multer.util";
import mentorAuthorize from "../Middleware/mentorAuthMiddleware";

import qaController from "../Controller/qaController";
import { mentorController } from "../Controller/mentorController";
import { bookingControlelr } from "../Controller/bookingController";
import { chatController } from "../Controller/chatController";
import { notificationController } from "../Controller/notificationController";

import qaService from "../Service/qaService";
import chatService from "../Service/chatService";
import { mentorService } from "../Service/mentorService";
import { bookingService } from "../Service/bookingService";
import { notificationService } from "../Service/notificationService";

import chatRepository from "../Repository/chatRepository";
import mentorRepository from "../Repository/mentorRepository";
import answerRepository from "../Repository/answerRepository";
import questionRepository from "../Repository/questionRepository";
import categoryRepository from "../Repository/categoryRepository";
import timeSlotRepository from "../Repository/timeSlotRepository";
import slotScheduleRepository from "../Repository/slotScheduleRepository";
import notificationRepository from "../Repository/notificationRepository";
import walletRepository from "../Repository/walletRepository";
import transactionRepository from "../Repository/transactionRepository";
import { walletController } from "../Controller/walletController";
import { walletService } from "../Service/walletService";
const __mentorService = new mentorService(
  mentorRepository,
  categoryRepository,
  questionRepository,
  timeSlotRepository,
  slotScheduleRepository
);

const __chatService = new chatService(chatRepository);
const __qaService = new qaService(
  questionRepository,
  answerRepository,
  notificationRepository
);
const __bookingService = new bookingService(
  timeSlotRepository,
  slotScheduleRepository,
  notificationRepository,
  chatRepository,
  walletRepository,
  transactionRepository
);
const __notificationService = new notificationService(notificationRepository);
const __walletService = new walletService(
  walletRepository,
  transactionRepository,
  notificationRepository
);
const __walletController = new walletController(__walletService);
const __mentorController = new mentorController(__mentorService);
const __qaController = new qaController(__qaService);
const __bookingController = new bookingControlelr(__bookingService);
const __notificationController = new notificationController(
  __notificationService
);

const __chatController = new chatController(__chatService);

const mentor_Router: Router = express.Router();

mentor_Router.post(
  `/logout`,
  __mentorController.mentorLogout.bind(__mentorController)
);
//profile
mentor_Router.get(
  `/profile`,
  mentorAuthorize,
  __mentorController.mentorProfile.bind(__mentorController)
);
mentor_Router.patch(
  `/profile/change_password`,
  mentorAuthorize,
  __mentorController.profilePasswordChange.bind(__mentorController)
);
mentor_Router.post(
  "/refresh-token",
  __mentorController.mentorRefreshToken.bind(__mentorController)
);
mentor_Router.patch(
  `/profile/image_change`,
  mentorAuthorize,
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  __mentorController.mentorProfileImageChange.bind(__mentorController)
);
mentor_Router.put(
  `/profile/edit_profile_details`,
  upload.fields([{ name: "resume", maxCount: 1 }]),
  __mentorController.mentorEditProfile.bind(__mentorController)
);
mentor_Router.get(
  `/home/:filter`,
  mentorAuthorize,
  __mentorController.questionData.bind(__mentorController)
);
mentor_Router.post(
  `/qa/create-new-answer`,
  mentorAuthorize,
  __qaController.createNewAnswer.bind(__qaController)
);
mentor_Router.patch(
  `/qa/edit-answer`,
  mentorAuthorize,
  __qaController.editAnswer.bind(__qaController)
);

//schedule
mentor_Router.post(
  `/schedule/create-slots`,
  mentorAuthorize,
  __mentorController.createTimeSlots.bind(__mentorController)
);
mentor_Router.get(
  `/schedule/get-time-slots`,
  mentorAuthorize,
  __mentorController.getTimeSlots.bind(__mentorController)
);
mentor_Router.delete(
  `/schedule/remove-time-slot`,
  mentorAuthorize,
  __mentorController.removeTimeSlot.bind(__mentorController)
);

mentor_Router.get(
  `/sessions`,
  mentorAuthorize,
  __bookingController.getBookedSession.bind(__bookingController)
);

mentor_Router.patch(
  `/sessions/cancel_request/:sessionId`,
  mentorAuthorize,
  __bookingController.mentorSlotCancel.bind(__bookingController)
);
mentor_Router.patch(
  `/sessions/create-session-code`,
  mentorAuthorize,
  __bookingController?.createSessionCode.bind(__bookingController)
);
mentor_Router.patch(
  `/sessions/mark-as-session-completed`,
  mentorAuthorize,
  __bookingController.sessionCompleted.bind(__bookingController)
);
//notification
mentor_Router.get(
  `/notification`,
  mentorAuthorize,
  __notificationController?.getNotification.bind(__notificationController)
);

mentor_Router.patch(
  `/notification-read/:notificationId`,
  mentorAuthorize,
  __notificationController.markAsReadNotif.bind(__notificationController)
);

//chat
mentor_Router.get(
  `/chats`,
  mentorAuthorize,
  __chatController.getChats.bind(__chatController)
);

mentor_Router.get(
  "/messages",
  mentorAuthorize,
  __chatController.getUserMessage.bind(__chatController)
);

mentor_Router.get(
  "/session/validate-session-join",
  mentorAuthorize,
  __bookingController.validateSessionJoin.bind(__bookingController)
);

//wallet'
mentor_Router.get(
  `/wallet`,
  mentorAuthorize,
  __walletController.getWalletData.bind(__walletController)
);
mentor_Router.put(
  `/withdraw-amount`,
  mentorAuthorize,
  __walletController.withdrawMentorEarnings.bind(__walletController)
);

mentor_Router.get(
  `/statistics`,
  mentorAuthorize,
  __mentorController.chartData.bind(__mentorController)
);
mentor_Router.get(
  "/turn-credentials",
  mentorAuthorize,
  __bookingController.turnServerConnection.bind(__bookingController)
);

export default mentor_Router;
