import express,{ Router } from "express";
import { MentorService } from "../SERVICE/MetnorService";
import { MentorController } from "../CONTROLLER/MentorController";
import MentorRepository from "../REPOSITORY/MentorRepository";



const __mentorService = new MentorService(MentorRepository)
const __mentorController = new MentorController(__mentorService)
const mentor_Router :Router =express.Router();


mentor_Router.post(`/logout`,__mentorController.getMentorLogout.bind(__mentorController));
mentor_Router.get(`/profile`,__mentorController.getMentorProfile.bind(__mentorController));
mentor_Router.post('/refresh-token',__mentorController.getMentorRefreshToken.bind(__mentorController))

export default mentor_Router;




