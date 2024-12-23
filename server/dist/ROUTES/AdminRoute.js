"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminService_1 = require("../SERVICE/AdminService");
const CategoryRepository_1 = __importDefault(require("../REPOSITORY/CategoryRepository"));
const AdminController_1 = require("../CONTROLLER/AdminController");
const MenteeRepository_1 = __importDefault(require("../REPOSITORY/MenteeRepository"));
const admin_Router = express_1.default.Router();
const _adminService = new AdminService_1.AdminService(CategoryRepository_1.default, MenteeRepository_1.default);
const _adminController = new AdminController_1.AdminController(_adminService);
admin_Router.post(`/create_category`, _adminController.getCreateCategory.bind(_adminController));
admin_Router.get('/category_management', _adminController.getCategoryData.bind(_adminController));
admin_Router.patch('/edit_category', _adminController.getEditCategory.bind(_adminController));
admin_Router.put(`/change_category_status`, _adminController.getChangeCategoryStatus.bind(_adminController));
admin_Router.get(`/mentee_management`, _adminController.getMenteeData.bind(_adminController));
admin_Router.patch(`/mentee_management/change_mentee_status`, _adminController.getChangeMenteeStatus.bind(_adminController));
admin_Router.put(`/mentee_management/edit_mentee`, _adminController.getEditMentee.bind(_adminController));
admin_Router.post(`/mentee_management/add_mentee`, _adminController.getAddMentee.bind(_adminController));
exports.default = admin_Router;
