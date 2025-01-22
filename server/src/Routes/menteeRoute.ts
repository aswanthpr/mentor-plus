import express, { Router } from "express";
import { menteeController } from "../Controller/menteeController";
import { menteeService } from "../Service/menteeService";
import menteeRepository from "../Repository/menteeRepository";
import upload from "../Config/multer.util";
import authorize from "../Middleware/menteeAuthorization";
import mentorRepository from "../Repository/mentorRepository";
import categoryRepository from "../Repository/categoryRepository";
import qaService from '../Service/qaService'
import qaController from "../Controller/qaController";
import questionRepository from "../Repository/questionRepository";
import answerRespository from "../Repository/answerRepository";

const __menteeService = new menteeService(
    menteeRepository,
    mentorRepository,
    categoryRepository,
    questionRepository
)
const __menteeController = new menteeController(__menteeService);
const __qaService = new qaService(questionRepository, answerRespository);
const __qaController = new qaController(__qaService)
const mentee_Router: Router = express.Router();

mentee_Router.post(`/refresh-token`, __menteeController.refreshToken.bind(__menteeController));

mentee_Router.post(`/logout`, __menteeController.menteeLogout.bind(__menteeController));

mentee_Router.get(`/explore`, __menteeController.exploreData.bind(__menteeController))

mentee_Router.get(`/profile`, authorize, __menteeController.menteeProfile.bind(__menteeController));
mentee_Router.put(`/profile/edit_profile`, authorize, __menteeController.menteeProfileEdit.bind(__menteeController));
mentee_Router.patch(`/profile/change_password`, authorize, __menteeController.passwordChange.bind(__menteeController))
mentee_Router.patch(`/profile/change_profile`, authorize, upload.fields([{ name: 'profileImage', maxCount: 1 }]), __menteeController.profileChange.bind(__menteeController));

mentee_Router.get(`/qa/:filter`, authorize, __qaController.questionData.bind(__qaController));
mentee_Router.post(`/qa/add-question`, authorize, __qaController.addQuestion.bind(__qaController));
mentee_Router.patch(`/qa/edit-question`, authorize, __qaController.editQuestion.bind(__qaController));

mentee_Router.get(`/home/:filter`, authorize, __menteeController.homeData.bind(__menteeController))

mentee_Router.delete(`/qa/delete/:questionId`, authorize, __menteeController.deleteQuestion.bind(__menteeController))

mentee_Router.post(`/qa/create-answer`, authorize, __qaController.createNewAnswer.bind(__qaController))
export default mentee_Router;
