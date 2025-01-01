import express,{Router} from 'express';
import {AdminService} from '../SERVICE/AdminService';
import CategoryRepository from '../REPOSITORY/CategoryRepository';
import { AdminController } from '../CONTROLLER/AdminController';
import  MenteeRepository  from '../REPOSITORY/MenteeRepository';
import MentorRepository from '../REPOSITORY/MentorRepository';


const admin_Router:Router = express.Router();

const _adminService = new AdminService(CategoryRepository,MenteeRepository,MentorRepository);

const _adminController  = new AdminController(_adminService);
//---------------------------------------------------------------------------------------------------------
admin_Router.post('/logout',_adminController.getAdminLogout.bind(_adminController));
admin_Router.patch('/edit_category',_adminController.getEditCategory.bind(_adminController));
admin_Router.post(`/create_category`,_adminController.getCreateCategory.bind(_adminController));
admin_Router.get('/category_management',_adminController.getCategoryData.bind(_adminController));
admin_Router.put(`/change_category_status`,_adminController.getChangeCategoryStatus.bind(_adminController));

admin_Router.get(`/mentee_management`,_adminController.getMenteeData.bind(_adminController));
admin_Router.post(`/mentee_management/add_mentee`,_adminController.getAddMentee.bind(_adminController));
admin_Router.put(`/mentee_management/edit_mentee`,_adminController.getEditMentee.bind(_adminController));
admin_Router.patch(`/mentee_management/change_mentee_status`,_adminController.getChangeMenteeStatus.bind(_adminController));

admin_Router.get(`/mentor_management`,_adminController.getMentorData.bind(_adminController));
admin_Router.patch(`/mentor_management/mentor_verify`,_adminController.getMentorVerify.bind(_adminController));
admin_Router.patch(`/mentor_management/change_mentor_status`,_adminController.getChangeMentorStatus.bind(_adminController));

export default  admin_Router 

