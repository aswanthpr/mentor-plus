import Stripe from "stripe";
import express, { Router } from "express";
import upload from "../Config/multer.util";
import qaService from "../Service/qaService";
import qaController from "../Controller/qaController";
import { menteeService } from "../Service/menteeService";
import authorize from "../Middleware/menteeAuthorization";
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

const __menteeService = new menteeService( 
  menteeRepository,
  mentorRepository,
  categoryRepository,
  questionRepository,
);
const __qaService = new qaService(
  questionRepository,
  answerRespository,
  notificationRepository,
  
);
const __bookingService = new bookingService(
  timeSlotRepository,
  slotScheduleRepository,
  notificationRepository,
  new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-01-27.acacia",
    maxNetworkRetries: 4,
  })
);

const __notificationService = new notificationService(
  notificationRepository,
)

const __chatService = new chatService(
  chatRepository,
);

const __menteeController = new menteeController(__menteeService);
const __qaController = new qaController(__qaService);
const __bookingController = new bookingControlelr(__bookingService);
const __notificationController = new notificationController(__notificationService);
const __chatController = new chatController(__chatService);
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
  `/explore`,authorize,
  __menteeController.exploreData.bind(__menteeController)
);

mentee_Router.get(
  `/profile`,
  authorize,
  __menteeController.menteeProfile.bind(__menteeController)
);
mentee_Router.put(
  `/profile/edit_profile`,
  authorize,
  __menteeController.menteeProfileEdit.bind(__menteeController)
);
mentee_Router.patch(
  `/profile/change_password`,
  authorize,
  __menteeController.passwordChange.bind(__menteeController)
);
mentee_Router.patch(
  `/profile/change_profile`,
  authorize,
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  __menteeController.profileChange.bind(__menteeController)
);

mentee_Router.get(
  `/qa/:filter`,
  authorize,
  __qaController.questionData.bind(__qaController)
);
mentee_Router.post(
  `/qa/add-question`,
  authorize,
  __qaController.addQuestion.bind(__qaController)
);
mentee_Router.patch(
  `/qa/edit-question`,
  authorize,
  __qaController.editQuestion.bind(__qaController)
);

mentee_Router.get(
  `/home/:filter`,
  authorize,
  __menteeController.homeData.bind(__menteeController)
);

mentee_Router.delete(
  `/qa/delete/:questionId`,
  authorize,
  __qaController.deleteQuestion.bind(__qaController)
);

mentee_Router.post(
  `/qa/create-answer`,
  authorize,
  __qaController.createNewAnswer.bind(__qaController)
);

mentee_Router.patch(
  `/qa/edit-answer`,
  authorize,
  __qaController.editAnswer.bind(__qaController)
);

mentee_Router.get(
  `/explore/similar-mentors`,
  authorize,
  __menteeController.getSimilarMentors.bind(__menteeController)
);

mentee_Router.get(
  `/slot-booking`,authorize,
  __bookingController.getTimeSlots.bind(__bookingController)
);

//slot book with rzorpay
mentee_Router.post(
  `/slot-booking`,
  authorize,
  __bookingController.slotBooking.bind(__bookingController)
);

mentee_Router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  __bookingController.stripeWebHook.bind(__bookingController)
);
// ./stripe listen --forward-to localhost:3000/mentee/webhook

mentee_Router.get(
  `/sessions`,
  authorize,
  __bookingController.getBookedSlot.bind(__bookingController)
);
mentee_Router.patch(
  `/sessions/cancel_request/:sessionId`,authorize,
  __bookingController.cancelSlot.bind(__bookingController)
);
mentee_Router.get(`/notification`,authorize,__notificationController.getNotification.bind(__notificationController));

mentee_Router.patch(`/notification-read/:notificationId`,authorize,__notificationController.markAsReadNotif.bind(__notificationController));

mentee_Router.get(`/chat`,authorize,__chatController.getChats.bind(__chatController));

export default mentee_Router;
