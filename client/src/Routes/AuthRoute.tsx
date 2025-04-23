import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "../components/Common/common4All/Spinner";
import InternalServer from "../pages/Error/InternalServer";
import NotFound from "../pages/Error/NotFound";

import MenteeLogout from "../Utils/ProtectedRoute/MenteeProtectLogout";
import AdminProtectLogout from "../Utils/ProtectedRoute/AdminProtectLogout";
import MentorProtectLogout from "../Utils/ProtectedRoute/MentorProtectLogout";
const Login = lazy(() => import("../pages/Auth/Login"));
const Landing = lazy(() => import("../pages/Landing/Landing"));
const SignupForm = lazy(() => import("../pages/Auth/SignupForm"));
const AdminLogin = lazy(() => import("../pages/Auth/AdminLogin"));
const MentorApply = lazy(() => import("../pages/Auth/MentorApply"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));

const AuthRoute: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      <Route path="/500" element={<InternalServer />} />
      <Route path="*" element={<NotFound />} />
      <Route element={<AdminProtectLogout />}>
        <Route element={<MentorProtectLogout />}>
          <Route element={<MenteeLogout />}>
            <Route path="/" element={<Landing />} />
            <Route path="auth/signup" element={<SignupForm />} />
            <Route path="auth/login/mentee" element={<Login />} />
            <Route path="auth/login/mentor" element={<Login />} />
            <Route
              path="auth/forgot_password/:user"
              element={<ForgotPassword />}
            />
            <Route path="auth/apply_as_mentor" element={<MentorApply/>}/>
            <Route path="auth/login/admin" element={<AdminLogin />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default AuthRoute;
