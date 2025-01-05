import React from "react";
import { Routes,Route } from "react-router-dom";
import MentorApply from "../pages/Auth/MentorApply";
import AdminLogin from "../pages/Auth/AdminLogin";
import Login from "../pages/Auth/Login";
import SignupForm from "../pages/Auth/SignupForm";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Landing from "../pages/Landing/Landing";
import MenteeLogout from "../Utils/ProtectedRoute/MenteeProtectLogout";
import AdminProtectLogout from "../Utils/ProtectedRoute/AdminProtectLogout";
import MentorProtectLogout from "../Utils/ProtectedRoute/MentorProtectLogout";

const AuthRoute: React.FC = () => (


    <Routes>
    {/* <Route path="/" element={<MentorProtectLogout element={ <Landing/>}/>}/> */}
    <Route path="/" element={<MenteeLogout element={<MentorProtectLogout element={<Landing/>}/>}/>}/>
    <Route path="auth/login/mentee" element={<MenteeLogout element={<Login/>}/>}/>
    <Route path='auth/login/mentor' element={<MentorProtectLogout element={<Login/>}/>}/>
    <Route path="auth/signup" element={<MenteeLogout element={<SignupForm/>}/>}/>
    {/* <Route path="auth/signup"  element={<SignupForm/>}/> */}
    <Route path="auth/forgot_password/:user" element={<ForgotPassword/>}/>
    {/* <Route path="mentee" element={<MenteeLogout element={<Login/>}/>}/> */}
    <Route path="auth/apply_as_mentor" element={<MentorProtectLogout element={<MentorApply/>}/>} />


    <Route path="auth/login/admin" element={<AdminProtectLogout element={<AdminLogin />}/>} />
  </Routes>


);

export default AuthRoute;
