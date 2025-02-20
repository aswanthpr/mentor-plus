import React, { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

const Home = lazy(() => import("../pages/Mentee/Home"));
import Spinner from "../components/Common/common4All/Spinner";
import InternalServer from "../pages/Error/InternalServer";
import NotFound from "../pages/Error/NotFound";
import { MentorProfile } from "../pages/Mentee/MentorProfile";
import { BookingPage } from "../components/Mentee/BookingPage";
import StripeCheckoutCancel from "../components/Common/Stripe/StripeCheckoutCancel";
import { StripeComplete } from "../components/Common/Stripe/StripeComplete";
import Message from "../pages/Mentee/Message";

const Bookings = lazy(() => import("../pages/Mentee/Bookings"));
const Wallet = lazy(() => import("../pages/Mentee/Wallet"));
const Explore = lazy(() => import("../pages/Mentee/Explore"));
const QnA_page = lazy(() => import("../pages/Mentee/QnA_page"));
const Mentee_Page = lazy(() => import("../pages/Mentee/Mentee_Page"));
const MenteeProfile = lazy(() => import("../pages/Mentee/MenteeProfile"));
const GoogleSuccess = lazy(() => import("../components/Mentee/GoogleSuccess"));
// const QuestionsList = lazy(() => import('../components/Common/Qa/QuestionsList'));
const GoogleFailure = lazy(() => import("../components/Mentee/GoogleFailure"));
const MenteeLogin = lazy(
  () => import("../Utils/ProtectedRoute/MenteeProtectLogin")
);

const MenteeRoute: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    ;
    <Routes>
      <Route path="*" element={<NotFound />} />;
      <Route path="/500" element={<InternalServer />} />;
      <Route path="/" element={<Mentee_Page />}>
        ;
        <Route index element={<Navigate to="/mentee/home" />} />;
        <Route path="/home" element={<MenteeLogin element={<Home />} />} />;
        <Route
          path="/profile/"
          element={<MenteeLogin element={<MenteeProfile />} />}
        />
        ;
        <Route path="explore">
          <Route index element={<MenteeLogin element={<Explore />} />} />
          {/* <Route path='mentor/:mentorId' element={<MentorProfile />} /> */}
          <Route
            path=":name"
            element={<MenteeLogin element={<MentorProfile />} />}
          />
          ;
        </Route>
        <Route path="/:name/slot-booking" element={<BookingPage />} />;
        <Route
          path="/bookings"
          element={<MenteeLogin element={<Bookings />} />}
        />
        ;
        <Route
          path="/messages"
          element={<MenteeLogin element={<Message/>} />}
        />
        {/* <Route path="/wallet" element={<MenteeLogin element={<Wallet />} />} />; */}
        <Route path="/qa" element={<MenteeLogin element={<QnA_page />} />} />;
        <Route path="/google/success" element={<GoogleSuccess />} />;
        <Route path="/google/failure" element={<GoogleFailure />} />;
      </Route>
      <Route path="/stripe-cancel" element={<StripeCheckoutCancel />} />
      <Route path="/stripe-success" element={<StripeComplete />} />
    </Routes>
  </Suspense>
);

export default MenteeRoute;
