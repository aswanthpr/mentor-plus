import express,{ Router } from "express";
import { MentorService } from "../SERVICE/MetnorService";
import { MentorController } from "../CONTROLLER/MentorController";
import MentorRepository from "../REPOSITORY/MentorRepository";
import mentorAuthorize from "../MIDDLEWARE/mentorAuthorization";
import CategoryRepository from "../REPOSITORY/CategoryRepository";
import upload from "../CONFIG/multer.util";



const __mentorService = new MentorService(MentorRepository,CategoryRepository)
const __mentorController = new MentorController(__mentorService)
const mentor_Router :Router =express.Router();


mentor_Router.post(`/logout`,__mentorController.getMentorLogout.bind(__mentorController));
//profile
mentor_Router.get(`/profile`,mentorAuthorize,__mentorController.getMentorProfile.bind(__mentorController));
mentor_Router.patch(`/profile/change_password`,mentorAuthorize,__mentorController.getProfilePasswordChange.bind(__mentorController))
mentor_Router.post('/refresh-token',__mentorController.getMentorRefreshToken.bind(__mentorController));
mentor_Router.patch(`/profile/image_change`,mentorAuthorize,upload.fields([{name:'profileImage',maxCount:1}]),__mentorController.getMentorProfileImageChange.bind(__mentorController));
mentor_Router.put(`/profile/edit_profile_details`,upload.fields([{name:'resume',maxCount:1},{name:'skills',maxCount:1}]),__mentorController.getMentorEditProfile.bind(__mentorController))


export default mentor_Router;




