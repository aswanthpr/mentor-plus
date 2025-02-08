import express, { Router } from "express";
import { mentorService } from "../Service/mentorService";
import { mentorController } from "../Controller/mentorController";
import mentorRepository from "../Repository/mentorRepository";
import mentorAuthorize from "../Middleware/mentorAuthorization";
import categoryRepository from "../Repository/categoryRepository";
import upload from "../Config/multer.util";
import questionRepository from "../Repository/questionRepository";
import answerRepository from "../Repository/answerRepository";
import qaService from "../Service/qaService";
import qaController from "../Controller/qaController";
import timeSlotRepository from "../Repository/timeSlotRepository";
import { bookingService } from "../Service/bookingService";
import { bookingControlelr } from "../Controller/bookingController";
import slotScheduleRepository from "../Repository/slotScheduleRepository";
const __mentorService = new mentorService(
  mentorRepository,
  categoryRepository,
  questionRepository,
  timeSlotRepository,

);

const __mentorController = new mentorController(__mentorService);
const __qaService = new qaService(questionRepository, answerRepository);
const __qaController = new qaController(__qaService);
const __bookingService = new bookingService(  timeSlotRepository,
    slotScheduleRepository);
const __bookingController = new bookingControlelr(__bookingService)
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
  __mentorController.homeData.bind(__mentorController)
);
mentor_Router.post(`/qa/create-new-answer`,mentorAuthorize, __qaController.createNewAnswer.bind(__qaController));
mentor_Router.patch(`/qa/edit-answer`,mentorAuthorize,__qaController.editAnswer.bind(__qaController));

//schedule
mentor_Router.post(`/schedule/create-slots`,mentorAuthorize,__mentorController.createTimeSlots.bind(__mentorController));
mentor_Router.get(`/schedule/get-time-slots`,mentorAuthorize,__mentorController.getTimeSlots.bind(__mentorController));
mentor_Router.delete(`/schedule/remove-time-slot`,mentorAuthorize,__mentorController.removeTimeSlot.bind(__mentorController))

mentor_Router.get(`/sessions`,mentorAuthorize,__bookingController.getBookedSession.bind(__bookingController));
export default mentor_Router;
