"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../CONTROLLER/AuthController");
const AuthService_1 = require("../SERVICE/AuthService");
const AuthRepo_1 = __importDefault(require("../REPOSITORY/AuthRepo"));
const authService = new AuthService_1.AuthService(AuthRepo_1.default);
const authController = new AuthController_1.AuthController(authService);
const auth_Router = express_1.default.Router();
auth_Router.post('/signup', authController.menteeSignup.bind(authController));
exports.default = auth_Router;
