import React, { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

const Home = lazy(() => import("../pages/Mentee/Home"));
import Spinner from "../components/Common/common4All/Spinner";
import InternalServer from "../pages/Error/InternalServer";
import NotFound from "../pages/Error/NotFound";
import MentorProfile from "../pages/Mentee/MentorProfile";
import BookingPage from "../components/Mentee/BookingPage";
import StripeCheckoutCancel from "../components/Common/Stripe/StripeCheckoutCancel";
import VideoPage from "../components/Common/Bookings/VideoPage";
import MenteeLogin from "../Utils/ProtectedRoute/MenteeProtectLogin";
import { ROUTES } from "../Constants/message";

const Message = lazy(() => import("../pages/Mentee/Message"));
const StripeComplete = lazy(
  () => import("../components/Common/Stripe/StripeComplete")
);
const Bookings = lazy(() => import("../pages/Mentee/Bookings"));
const Wallet = lazy(() => import("../pages/Mentee/Wallet"));
const Explore = lazy(() => import("../pages/Mentee/Explore"));
const QnA_page = lazy(() => import("../pages/Mentee/QnA_page"));
const Mentee_Page = lazy(() => import("../pages/Mentee/Mentee_Page"));
const MenteeProfile = lazy(() => import("../pages/Mentee/MenteeProfile"));
import GoogleFailure from "../components/Mentee/GoogleFailure";
import GoogleSuccess from "../components/Mentee/GoogleSuccess";

const MenteeRoute: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    ;
    <Routes>
    <Route path="/google/success" element={<GoogleSuccess />} />
    <Route path="/google/failure" element={<GoogleFailure />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/500" element={<InternalServer />} />
        <Route index element={<Navigate to={ROUTES?.MENTEE_HOME} />} />;
        <Route element={<MenteeLogin />}>
      <Route path="/" element={<Mentee_Page />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile/" element={<MenteeProfile />} />
          <Route path="explore">
            <Route index element={<Explore />} />
            <Route path="mentor/:mentorId" element={<MentorProfile />} />
            <Route path=":name" element={<MentorProfile />} />
          </Route>
          <Route path="/:name/slot-booking" element={<BookingPage />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/:roomId" element={<VideoPage />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/qa" element={<QnA_page />} />
          <Route path="/stripe-cancel" element={<StripeCheckoutCancel />} />
          <Route path="/stripe-success" element={<StripeComplete />} />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default MenteeRoute;
