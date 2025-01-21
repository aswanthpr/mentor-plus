import express, { Router } from "express";
import { MenteeController } from "../Controller/menteeController";
import { MenteeService } from "../Service/menteeService";
import MenteeRepository from "../Repository/menteeRepository";
import upload from "../Config/multer.util";
import authorize from "../Middleware/menteeAuthorization";
import MentorRepository from "../Repository/mentorRepository";
import CategoryRepository from "../Repository/categoryRepository";
import qaService from '../Service/qaService'
import qaController from "../Controller/qaController";
import questionRepository from "../Repository/questionRepository";
import answerRespository from "../Repository/answerRepository";

const __menteeService = new MenteeService(
    MenteeRepository,
    MentorRepository,
    CategoryRepository,
    questionRepository
)
const __menteeController = new MenteeController(__menteeService);
const __qaService = new qaService(questionRepository,answerRespository);
const __qaController = new qaController(__qaService)
const mentee_Router: Router = express.Router();

mentee_Router.post(`/refresh-token`, __menteeController.getRefreshToken.bind(__menteeController));

mentee_Router.post(`/logout`, __menteeController.getMenteeLogout.bind(__menteeController));

mentee_Router.get(`/explore`, __menteeController.getExploreData.bind(__menteeController))

mentee_Router.get(`/profile`, authorize, __menteeController.getMenteeProfile.bind(__menteeController));
mentee_Router.put(`/profile/edit_profile`, authorize, __menteeController.getMenteeProfileEdit.bind(__menteeController));
mentee_Router.patch(`/profile/change_password`, authorize, __menteeController.getPasswordChange.bind(__menteeController))
mentee_Router.patch(`/profile/change_profile`, authorize, upload.fields([{ name: 'profileImage', maxCount: 1 }]), __menteeController.getProfileChange.bind(__menteeController));

mentee_Router.get(`/qa/:filter`, authorize, __qaController.getQuestionData.bind(__qaController));
mentee_Router.post(`/qa/add-question`, authorize, __qaController.addQuestion.bind(__qaController));
mentee_Router.patch(`/qa/edit-question`, authorize, __qaController.editQuestion.bind(__qaController));

mentee_Router.get(`/home/:filter`, authorize, __menteeController.getHomeData.bind(__menteeController))

mentee_Router.delete(`/qa/delete/:questionId`,authorize,__menteeController.deleteQuestion.bind(__menteeController))

mentee_Router.post(`/qa/create-answer`,authorize,__qaController.createNewAnswer.bind(__qaController))
export default mentee_Router;  
      