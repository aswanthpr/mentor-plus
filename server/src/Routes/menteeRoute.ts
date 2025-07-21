import express, { Router } from "express";
import upload from "../Config/multer.util";
import qaService from "../Service/qaService";
import qaController from "../Controller/qaController";
import { menteeService } from "../Service/menteeService";
// import authorize from "../Middleware/menteeAuthMiddleware";
import { bookingService } from "../Service/bookingService";
import menteeRepository from "../Repository/menteeRepository";
import mentorRepository from "../Repository/mentorRepository";
import answerRespository from "../Repository/answerRepository";
import { menteeController } from "../Controller/menteeController";
import categoryRepository from "../Repository/categoryRepository";
import questionRepository from "../Repository/questionRepository";
import timeSlotRepository from "../Repository/timeSlotRepository";
import { bookingControlelr } from "../Controller/bookingController";
import { notificationService } from "../Service/notificationService";
import notificationRepository from "../Repository/notificationRepository";
import slotScheduleRepository from "../Repository/slotScheduleRepository";
import { notificationController } from "../Controller/notificationController";
import chatService from "../Service/chatService";
import chatRepository from "../Repository/chatRepository";
import { chatController } from "../Controller/chatController";
import { walletService } from "../Service/walletService";
import transactionRepository from "../Repository/transactionRepository";
import { walletController } from "../Controller/walletController";
import walletRepository from "../Repository/walletRepository";
import { reviewController } from "../Controller/reviewController";
import reviewRepository from "../Repository/reviewRepository";
import { reviewService } from "../Service/reviewService";
import authorizeUser from "../Middleware/authorizeUser";

const __menteeService = new menteeService(
  menteeRepository,
  mentorRepository,
  categoryRepository,
  questionRepository
);
const __qaService = new qaService(
  questionRepository,
  answerRespository,
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
const __chatService = new chatService(chatRepository);
const __walletService = new walletService(
  walletRepository,
  transactionRepository,
  notificationRepository
);
const __reviewService = new reviewService(reviewRepository);

const __menteeController = new menteeController(__menteeService);
const __qaController = new qaController(__qaService);
const __bookingController = new bookingControlelr(__bookingService);
const __notificationController = new notificationController(
  __notificationService
);
const __chatController = new chatController(__chatService);
const __walletController = new walletController(__walletService);
const __reviewController = new reviewController(__reviewService);

const mentee_Router: Router = express.Router();

mentee_Router.post(
  `/refresh-token`,
  __menteeController.refreshToken.bind(__menteeController)
);

mentee_Router.post(
  `/logout`,
  __menteeController.menteeLogout.bind(__menteeController)
);

mentee_Router.get(
  `/explore`,
  authorizeUser('mentee'),
  __menteeController.exploreData.bind(__menteeController)
);

mentee_Router.get(
  `/profile`,
  authorizeUser('mentee'),
  __menteeController.menteeProfile.bind(__menteeController)
);
mentee_Router.put(
  `/profile/edit_profile`,
  authorizeUser('mentee'),
  __menteeController.menteeProfileEdit.bind(__menteeController)
);
mentee_Router.patch(
  `/profile/change_password`,
  authorizeUser('mentee'),
  __menteeController.passwordChange.bind(__menteeController)
);
mentee_Router.patch(
  `/profile/change_profile`,
  authorizeUser('mentee'),
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  __menteeController.profileChange.bind(__menteeController)
);

mentee_Router.get(
  `/qa`,
  authorizeUser('mentee'),
  __qaController.questionData.bind(__qaController)
);
mentee_Router.post(
  `/qa/add-question`,
  authorizeUser('mentee'),
  __qaController.addQuestion.bind(__qaController)
);
mentee_Router.patch(
  `/qa/edit-question`,
  authorizeUser('mentee'),
  __qaController.editQuestion.bind(__qaController)
);

mentee_Router.get(
  `/home/:filter`,
  authorizeUser('mentee'),
  __menteeController.homeData.bind(__menteeController)
);

mentee_Router.delete(
  `/qa/delete/:questionId`,
  authorizeUser('mentee'),
  __qaController.deleteQuestion.bind(__qaController)
);

mentee_Router.post(
  `/qa/create-answer`,
  authorizeUser('mentee'),
  __qaController.createNewAnswer.bind(__qaController)
);

mentee_Router.patch(
  `/qa/edit-answer`,
  authorizeUser('mentee'),
  __qaController.editAnswer.bind(__qaController)
);

mentee_Router.get(
  `/explore/similar-mentors`,
  authorizeUser('mentee'),
  __menteeController.getSimilarMentors.bind(__menteeController)
);

mentee_Router.get(
  `/slot-booking`,
  authorizeUser('mentee'),
  __bookingController.getTimeSlots.bind(__bookingController)
);

//slot book with rzorpay
mentee_Router.post(
  `/slot-booking`,
  authorizeUser('mentee'),
  __bookingController.slotBooking.bind(__bookingController)
);

mentee_Router.post(
  "/booking/webhook",
  express.raw({ type: "application/json" }),
  __bookingController.stripeWebHook.bind(__bookingController)
);
// ./stripe listen --forward-to localhost:3000/mentee/webhook

mentee_Router.get(
  `/sessions`,
  authorizeUser('mentee'),
  __bookingController.getBookedSlot.bind(__bookingController)
);
mentee_Router.patch(
  `/sessions/cancel_request/:sessionId`,
  authorizeUser('mentee'),
  __bookingController.cancelSlot.bind(__bookingController)
);
mentee_Router.get(
  `/notification`,
  authorizeUser('mentee'),
  __notificationController.getNotification.bind(__notificationController)
);

mentee_Router.patch(
  `/notification-read/:notificationId`,
  authorizeUser('mentee'),
  __notificationController.markAsReadNotif.bind(__notificationController)
);

mentee_Router.get(
  "/chats",
  authorizeUser('mentee'),
  __chatController.getChats.bind(__chatController)
);

mentee_Router.get(
  "/messages",
  authorizeUser('mentee'),
  __chatController.getUserMessage.bind(__chatController)
);

mentee_Router.get(
  `/session/validate-session-join`,
  authorizeUser('mentee'),
  __bookingController.validateSessionJoin.bind(__bookingController)
);

//wallet'
mentee_Router.get(
  `/wallet`,
  authorizeUser('mentee'),
  __walletController.getWalletData.bind(__walletController)
);

mentee_Router.post(
  "/wallet/add-money-wallet",
  authorizeUser('mentee'),
  __walletController.addMoneyToWallet.bind(__walletController)
);

mentee_Router.post(
  "/wallet/webhook",
  express.raw({ type: "application/json" }),
  __walletController.walletStripeWebHook.bind(__walletController)
);

mentee_Router.post(
  "/review-and-rating",
  authorizeUser('mentee'),
  __reviewController.reviewNdRateMentor.bind(__reviewController)
);
mentee_Router.get(
  "/turn-credentials",
  authorizeUser('mentee'),
  __bookingController.turnServerConnection.bind(__bookingController)
);

export default mentee_Router;
