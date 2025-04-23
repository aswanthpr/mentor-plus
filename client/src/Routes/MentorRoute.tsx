import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Spinner from "../components/Common/common4All/Spinner";
import MentorProtectLogin from "../Utils/ProtectedRoute/MentorProtectLogin";

const VideoPage = lazy(() => import("../components/Common/Bookings/VideoPage"));
const Chat = lazy(() => import("../pages/Mentor/Chat"));
const NotFound = lazy(() => import("../pages/Error/NotFound"));
const Sessions = lazy(() => import("../pages/Mentor/Sessions"));
const Schedule = lazy(() => import("../pages/Mentor/Schedule"));
const MentorQna = lazy(() => import("../pages/Mentor/MentorQna"));
const WalletPage = lazy(() => import("../pages/Mentor/WalletPage"));
const MentorHome = lazy(() => import("../pages/Mentor/Statistics"));
const Mentor_Page = lazy(() => import("../pages/Mentor/Mentor_Page"));
const MentorProfile = lazy(() => import("../pages/Mentor/MentorProfile"));
const InternalServer = lazy(() => import("../pages/Error/InternalServer"));

const MentorRoute: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/500" element={<InternalServer />} />
        <Route index element={<Navigate to="/home" />} />
      <Route path="/" element={<Mentor_Page />}>
        <Route element={<MentorProtectLogin />}>
          <Route path="/messages" element={<Chat/>} />
          <Route path="/home" element={<MentorHome />} />
          <Route path="/session" element={<Sessions />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/profile" element={<MentorProfile />} />
          <Route path="/session/:roomId" element={<VideoPage />} />
          <Route path="/question_Answeres" element={<MentorQna />} />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default MentorRoute;
