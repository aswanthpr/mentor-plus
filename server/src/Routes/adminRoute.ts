import express,{Router} from 'express';
import {adminService} from '../Service/adminService';
import categoryRepository from '../Repository/categoryRepository';
import { adminController } from '../Controller/adminController';
import  menteeRepository  from '../Repository/menteeRepository';
import mentorRepository from '../Repository/mentorRepository';
import authorization from "../Middleware/adminAuthorization"
import qaService from '../Service/qaService';
import qaController from '../Controller/qaController';
import questionRepository from '../Repository/questionRepository';
import answerRepository from '../Repository/answerRepository';
import notificationRepository from '../Repository/notificationRepository';

const admin_Router:Router = express.Router();

const _adminService = new adminService(categoryRepository,menteeRepository,mentorRepository,notificationRepository);

const _adminController  = new adminController(_adminService);
const __qaService = new qaService(questionRepository, answerRepository,notificationRepository);
const __qaController = new qaController(__qaService)
//---------------------------------------------------------------------------------------------------------
admin_Router.post('/logout',_adminController.adminLogout.bind(_adminController));
admin_Router.get('/category_management',authorization,_adminController.categoryData.bind(_adminController));
admin_Router.patch('/edit_category',authorization,_adminController.editCategory.bind(_adminController));
admin_Router.post(`/create_category`,authorization,_adminController.createCategory.bind(_adminController));
admin_Router.put(`/change_category_status`,authorization,_adminController.changeCategoryStatus.bind(_adminController));

admin_Router.get(`/mentee_management`,authorization,_adminController.menteeData.bind(_adminController));
admin_Router.post(`/mentee_management/add_mentee`,_adminController.addMentee.bind(_adminController));
admin_Router.put(`/mentee_management/edit_mentee`,_adminController.editMentee.bind(_adminController));
admin_Router.patch(`/mentee_management/change_mentee_status`,authorization,_adminController.changeMenteeStatus.bind(_adminController));

admin_Router.get(`/mentor_management`,authorization,_adminController.mentorData.bind(_adminController));
admin_Router.patch(`/mentor_management/mentor_verify`,authorization,_adminController.mentorVerify.bind(_adminController));
admin_Router.patch(`/mentor_management/change_mentor_status`,authorization,_adminController.changeMentorStatus.bind(_adminController));
admin_Router.post(`/refresh-token`,_adminController.adminRefreshToken.bind(_adminController));
admin_Router.get(`/qa-management`,authorization,__qaController.allQaData.bind(__qaController));
admin_Router.patch(`/qa_management/change_question_status`,authorization,__qaController.blockQuestion.bind(__qaController))
admin_Router.patch(`/qa_management/change_answer_status`,authorization,__qaController.blockAnswer.bind(__qaController))

export default  admin_Router  

