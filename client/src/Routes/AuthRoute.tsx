import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "../components/Common/common4All/Spinner";
import InternalServer from "../pages/Error/InternalServer";
import NotFound from "../pages/Error/NotFound";

const Login = lazy(() => import("../pages/Auth/Login"));
const Landing = lazy(() => import("../pages/Landing/Landing"));
const SignupForm = lazy(() => import("../pages/Auth/SignupForm"));
const AdminLogin = lazy(() => import("../pages/Auth/AdminLogin"));
const MentorApply = lazy(() => import("../pages/Auth/MentorApply"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const MenteeLogout = lazy(() => import("../Utils/ProtectedRoute/MenteeProtectLogout"));
const AdminProtectLogout = lazy(() => import("../Utils/ProtectedRoute/AdminProtectLogout"));
const MentorProtectLogout = lazy(() => import("../Utils/ProtectedRoute/MentorProtectLogout"));

const AuthRoute: React.FC = () => (

  <Suspense fallback={<Spinner />}>
    <Routes>
    <Route path='*' element={<NotFound/>} />
    <Route path='/500' element={<InternalServer/>}/>
      {/* <Route path="/" element={<MentorProtectLogout element={ <Landing/>}/>}/> */}
      <Route path="/" element={<MenteeLogout element={<MentorProtectLogout element={<Landing />} />} />} />
      <Route path="auth/login/mentee" element={<MenteeLogout element={<Login />} />} />
      <Route path='auth/login/mentor' element={<MentorProtectLogout element={<Login />} />} />
      <Route path="auth/signup" element={<MenteeLogout element={<SignupForm />} />} />
      {/* <Route path="auth/signup"  element={<SignupForm/>}/> */}
      <Route path="auth/forgot_password/:user" element={<ForgotPassword />} />
      {/* <Route path="mentee" element={<MenteeLogout element={<Login/>}/>}/> */}
      <Route path="auth/apply_as_mentor" element={<MentorProtectLogout element={<MentorApply />} />} />

      <Route path="auth/login/admin" element={<AdminProtectLogout element={<AdminLogin />} />} />
    </Routes>

  </Suspense>
);

export default AuthRoute;
