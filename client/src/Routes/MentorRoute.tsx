import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
const Mentor_Page = lazy(() => import("../pages/Mentor/Mentor_Page"));
const MentorHome = lazy(() => import("../pages/Mentor/MentorHome"));
const MentorProfile = lazy(() => import("../pages/Mentor/MentorProfile"));
const MentorProtectLogin = lazy(
  () => import("../Utils/ProtectedRoute/MentorProtectLogin")
);
const Schedule = lazy(() => import("../pages/Mentor/Schedule"));
const Sessions = lazy(()=>import ('../pages/Mentor/Sessions'))
import Spinner from "../components/Common/common4All/Spinner";
import NotFound from "../pages/Error/NotFound";
import InternalServer from "../pages/Error/InternalServer";


const MentorRoute: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
    <Route path='*' element={<NotFound/>} />
    <Route path='/500' element={<InternalServer/>}/>
      <Route path="/" element={<Mentor_Page />}>
        <Route index element={<Navigate to="home" />} />
        <Route
          path="/home"
          element={<MentorProtectLogin element={<MentorHome />} />}
        />
        ;
        <Route
          path="/profile"
          element={<MentorProtectLogin element={<MentorProfile />} />}
        />
        ;
        <Route
          path="/schedule"
          element={<MentorProtectLogin element={<Schedule />} />}
        />
        <Route
          path="/session"
          element={<MentorProtectLogin element={<Sessions />} />}
        />
      </Route>
    </Routes>
  </Suspense>
);

export default MentorRoute;
