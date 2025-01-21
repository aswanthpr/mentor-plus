import express,{Router} from 'express';
import {adminService} from '../Service/adminService';
import CategoryRepository from '../Repository/categoryRepository';
import { adminController } from '../Controller/adminController';
import  MenteeRepository  from '../Repository/menteeRepository';
import MentorRepository from '../Repository/mentorRepository';
import authorization from "../Middleware/adminAuthorization"
const admin_Router:Router = express.Router();

const _adminService = new adminService(CategoryRepository,MenteeRepository,MentorRepository);

const _adminController  = new adminController(_adminService);
//---------------------------------------------------------------------------------------------------------
admin_Router.post('/logout',_adminController.getAdminLogout.bind(_adminController));
admin_Router.get('/category_management',authorization,_adminController.getCategoryData.bind(_adminController));
admin_Router.patch('/edit_category',authorization,_adminController.getEditCategory.bind(_adminController));
admin_Router.post(`/create_category`,authorization,_adminController.getCreateCategory.bind(_adminController));
admin_Router.put(`/change_category_status`,authorization,_adminController.getChangeCategoryStatus.bind(_adminController));

admin_Router.get(`/mentee_management`,authorization,_adminController.getMenteeData.bind(_adminController));
admin_Router.post(`/mentee_management/add_mentee`,_adminController.getAddMentee.bind(_adminController));
admin_Router.put(`/mentee_management/edit_mentee`,_adminController.getEditMentee.bind(_adminController));
admin_Router.patch(`/mentee_management/change_mentee_status`,authorization,_adminController.getChangeMenteeStatus.bind(_adminController));

admin_Router.get(`/mentor_management`,authorization,_adminController.getMentorData.bind(_adminController));
admin_Router.patch(`/mentor_management/mentor_verify`,authorization,_adminController.getMentorVerify.bind(_adminController));
admin_Router.patch(`/mentor_management/change_mentor_status`,authorization,_adminController.getChangeMentorStatus.bind(_adminController));
admin_Router.post(`/refresh-token`,_adminController.getAdminRefreshToken.bind(_adminController));

export default  admin_Router 

