import express,{ Router } from "express";
import { MenteeController } from "../CONTROLLER/MenteeController";
import { MenteeService } from "../SERVICE/MenteeService";
import MenteeRepository from "../REPOSITORY/MenteeRepository";
import upload from "../CONFIG/multer.util";
import authorize from "../MIDDLEWARE/menteeAuthorization";
import MentorRepository from "../REPOSITORY/MentorRepository";
import CategoryRepository from "../REPOSITORY/CategoryRepository";

const __menteeService = new MenteeService(MenteeRepository,MentorRepository,CategoryRepository)
const __menteeController = new MenteeController(__menteeService)
const mentee_Router:Router =express.Router();

mentee_Router.post(`/refresh-token`,__menteeController.getRefreshToken.bind(__menteeController))
mentee_Router.post(`/logout`,__menteeController.getMenteeLogout.bind(__menteeController));
mentee_Router.get(`/profile`,authorize,__menteeController.getMenteeProfile.bind(__menteeController));
mentee_Router.put(`/profile/edit_profile`,authorize ,__menteeController.getMenteeProfileEdit.bind(__menteeController));
mentee_Router.patch(`/profile/change_password`,authorize,__menteeController.getPasswordChange.bind(__menteeController))
mentee_Router.patch(`/profile/change_profile`,authorize,upload.fields([{name:'profileImage',maxCount:1}]),__menteeController.getProfileChange.bind(__menteeController));
mentee_Router.get(`/explore`,__menteeController.getExploreData.bind(__menteeController))


export default mentee_Router; 
