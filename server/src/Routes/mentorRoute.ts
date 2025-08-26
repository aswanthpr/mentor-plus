import express, { Router } from "express";
import upload from "../Middleware/multer.";

import qaController from "../Controller/implementation/qaController";
import { mentorController } from "../Controller/implementation/mentorController";
import { bookingControlelr } from "../Controller/implementation/bookingController";
import { chatController } from "../Controller/implementation/chatController";
import { notificationController } from "../Controller/implementation/notificationController";

import qaService from "../Service/implementation/qaService";
import chatService from "../Service/implementation/chatService";
import { mentorService } from "../Service/implementation/mentorService";
import { bookingService } from "../Service/implementation/bookingService";
import { notificationService } from "../Service/implementation/notificationService";

import chatRepository from "../Repository/implementation/chatRepository";
import mentorRepository from "../Repository/implementation/mentorRepository";
import answerRepository from "../Repository/implementation/answerRepository";
import questionRepository from "../Repository/implementation/questionRepository";
import categoryRepository from "../Repository/implementation/categoryRepository";
import timeSlotRepository from "../Repository/implementation/timeSlotRepository";
import slotScheduleRepository from "../Repository/implementation/slotScheduleRepository";
import notificationRepository from "../Repository/implementation/notificationRepository";
import walletRepository from "../Repository/implementation/walletRepository";
import transactionRepository from "../Repository/implementation/transactionRepository";
import { walletController } from "../Controller/implementation/walletController";
import { walletService } from "../Service/implementation/walletService";
import authorizeUser from "../Middleware/authorizeUser";
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
  authorizeUser('mentor'),
  __mentorController.mentorProfile.bind(__mentorController)
);
mentor_Router.patch(
  `/profile/change_password`,
  authorizeUser('mentor'),
  __mentorController.profilePasswordChange.bind(__mentorController)
);
mentor_Router.post(
  "/refresh-token",
  __mentorController.mentorRefreshToken.bind(__mentorController)
);
mentor_Router.patch(
  `/profile/image_change`,
  authorizeUser('mentor'),
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
  authorizeUser('mentor'),
  __mentorController.questionData.bind(__mentorController)
);
mentor_Router.post(
  `/qa/create-new-answer`,
  authorizeUser('mentor'),
  __qaController.createNewAnswer.bind(__qaController)
);
mentor_Router.patch(
  `/qa/edit-answer`,
  authorizeUser('mentor'),
  __qaController.editAnswer.bind(__qaController)
);

//schedule
mentor_Router.post(
  `/schedule/create-slots`,
  authorizeUser('mentor'),
  __mentorController.createTimeSlots.bind(__mentorController)
);
mentor_Router.get(
  `/schedule/get-time-slots`,
  authorizeUser('mentor'),
  __mentorController.getTimeSlots.bind(__mentorController)
);
mentor_Router.delete(
  `/schedule/remove-time-slot`,
  authorizeUser('mentor'),
  __mentorController.removeTimeSlot.bind(__mentorController)
);

mentor_Router.get(
  `/sessions`,
  authorizeUser('mentor'),
  __bookingController.getBookedSession.bind(__bookingController)
);

mentor_Router.patch(
  `/sessions/cancel_request/:sessionId`,
  authorizeUser('mentor'),
  __bookingController.mentorSlotCancel.bind(__bookingController)
);
mentor_Router.patch(
  `/sessions/create-session-code`,
  authorizeUser('mentor'),
  __bookingController?.createSessionCode.bind(__bookingController)
);
mentor_Router.patch(
  `/sessions/mark-as-session-completed`,
  authorizeUser('mentor'),
  __bookingController.sessionCompleted.bind(__bookingController)
);
//notification
mentor_Router.get(
  `/notification`,
  authorizeUser('mentor'),
  __notificationController?.getNotification.bind(__notificationController)
);

mentor_Router.patch(
  `/notification-read/:notificationId`,
  authorizeUser('mentor'),
  __notificationController.markAsReadNotif.bind(__notificationController)
);

//chat
mentor_Router.get(
  `/chats`,
  authorizeUser('mentor'),
  __chatController.getChats.bind(__chatController)
);

mentor_Router.get(
  "/messages",
  authorizeUser('mentor'),
  __chatController.getUserMessage.bind(__chatController)
);

mentor_Router.get(
  "/session/validate-session-join",
  authorizeUser('mentor'),
  __bookingController.validateSessionJoin.bind(__bookingController)
);

//wallet'
mentor_Router.get(
  `/wallet`,
  authorizeUser('mentor'),
  __walletController.getWalletData.bind(__walletController)
);
mentor_Router.put(
  `/withdraw-amount`,
  authorizeUser('mentor'),
  __walletController.withdrawMentorEarnings.bind(__walletController)
);

mentor_Router.get(
  `/statistics`,
  authorizeUser('mentor'),
  __mentorController.chartData.bind(__mentorController)
);
mentor_Router.get(
  "/turn-credentials",
  authorizeUser('mentor'),
  __bookingController.turnServerConnection.bind(__bookingController)
);

export default mentor_Router;
