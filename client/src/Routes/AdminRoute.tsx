import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
const Admin_Page = lazy(() => import("../pages/Admin/Admin_Page"));
const Category_mgt = lazy(() => import("../pages/Admin/Category_mgt"));
const Dashboard = lazy(() => import("../pages/Admin/Dashboard"));
const Mentor_mgt = lazy(() => import("../pages/Admin/Mentor_mgt"));
const Mentee_mgt = lazy(() => import("../pages/Admin/Mentee_mgt"));
const QA_mgt = lazy(() => import("../pages/Admin/QA_mgt"));
const AdminProtectLogin = lazy(
  () => import("../Utils/ProtectedRoute/AdminProtectLogin")
);
const InternalServer = lazy(() => import("../pages/Error/InternalServer"));
const NotFound = lazy(() => import("../pages/Error/NotFound"));
import Spinner from "../components/Common/common4All/Spinner";

const AdminRoute: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/500" element={<InternalServer />} />
      <Route path="/" element={<Admin_Page />}>
        <Route element={<AdminProtectLogin />}>
          <Route index path="dashboard" element={<Dashboard />} />
          <Route path="category_management" element={<Category_mgt />} />
          <Route path="mentor_management" element={<Mentor_mgt />}>
            <Route path="verified" element={<Mentor_mgt />} />
            <Route path="not_verified" element={<Mentor_mgt />} />
          </Route>
          <Route path="mentee_management" element={<Mentee_mgt />} />
          <Route path="qa_management" element={<QA_mgt />} />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default AdminRoute;
