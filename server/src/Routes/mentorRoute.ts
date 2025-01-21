import express, { Router } from "express";
import { MentorService } from "../Service/mentorService";
import { MentorController } from "../Controller/mentorController";
import MentorRepository from "../Repository/mentorRepository";
import mentorAuthorize from "../Middleware/mentorAuthorization";
import CategoryRepository from "../Repository/categoryRepository";
import upload from "../Config/multer.util";
import questionRepository from "../Repository/questionRepository";

const __mentorService = new MentorService(
  MentorRepository,
  CategoryRepository,
  questionRepository
);

const __mentorController = new MentorController(__mentorService);
const mentor_Router: Router = express.Router();

mentor_Router.post(
  `/logout`,
  __mentorController.getMentorLogout.bind(__mentorController)
);
//profile
mentor_Router.get(
  `/profile`,
  mentorAuthorize,
  __mentorController.getMentorProfile.bind(__mentorController)
);
mentor_Router.patch(
  `/profile/change_password`,
  mentorAuthorize,
  __mentorController.getProfilePasswordChange.bind(__mentorController)
);
mentor_Router.post(
  "/refresh-token",
  __mentorController.getMentorRefreshToken.bind(__mentorController)
);
mentor_Router.patch(
  `/profile/image_change`,
  mentorAuthorize,
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  __mentorController.getMentorProfileImageChange.bind(__mentorController)
);
mentor_Router.put(
  `/profile/edit_profile_details`,
  upload.fields([{ name: "resume", maxCount: 1 }]),
  __mentorController.getMentorEditProfile.bind(__mentorController)
);
mentor_Router.get(
  `/home/:filter`,
  mentorAuthorize,
  __mentorController.getHomeData.bind(__mentorController)
);
export default mentor_Router;
