import React from "react";
import { Routes,Route } from "react-router-dom";
import MentorApply from "../pages/Auth/MentorApply";
import AdminLogin from "../pages/Auth/AdminLogin";
import Login from "../pages/Auth/Login";
import SignupForm from "../pages/Auth/SignupForm";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Landing from "../pages/Landing/Landing";


const AuthRoute: React.FC = () => (
    <Routes>
    <Route path="/" element={ <Landing/>}/>
    <Route path="auth/login"  element={<Login/>}/>
    <Route path="auth/signup"  element={<SignupForm/>}/>
    <Route path="auth/forgot_password/:user" element={<ForgotPassword/>}/>
    <Route path="auth/apply_as_mentor" element={<MentorApply/>} />
    <Route path="auth/admin/login" element={<AdminLogin />} />
  </Routes>
);

export default AuthRoute;
