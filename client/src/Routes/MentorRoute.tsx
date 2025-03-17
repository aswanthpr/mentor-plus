import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Spinner from "../components/Common/common4All/Spinner";
import VideoPage from "../components/Common/Bookings/VideoPage";
import WalletPage from "../pages/Mentor/WalletPage";
import Statistics from "../pages/Mentor/Statistics";


const Chat  = lazy(() => import("../pages/Mentor/Chat"));
const NotFound = lazy(() => import("../pages/Error/NotFound"));
const Sessions = lazy(() => import("../pages/Mentor/Sessions"));
const Schedule = lazy(() => import("../pages/Mentor/Schedule"));
const MentorHome = lazy(() => import("../pages/Mentor/MentorHome"));
const Mentor_Page = lazy(() => import("../pages/Mentor/Mentor_Page"));
const MentorProfile = lazy(() => import("../pages/Mentor/MentorProfile"));
const InternalServer = lazy(() => import("../pages/Error/InternalServer"));
const MentorProtectLogin = lazy(
  () => import("../Utils/ProtectedRoute/MentorProtectLogin")
);

const MentorRoute: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/500" element={<InternalServer />} />
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
         <Route path="/session/:roomId" element={<MentorProtectLogin element={<VideoPage/>} />} /> 
  <Route path="/wallet" element={<MentorProtectLogin element={<WalletPage />} />} />;
        <Route
          path="/messages"
          element={<MentorProtectLogin element={<Chat />} />}
        />
        <Route
          path="/statistics"
          element={<MentorProtectLogin element={<Statistics />} />} 
        />
      </Route>
    </Routes>
  </Suspense>
);

export default MentorRoute;
