import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
const Admin_Page = lazy(() => import('../pages/Admin/Admin_Page'));
const Category_mgt = lazy(() => import('../pages/Admin/Category_mgt'))
const Dashboard = lazy(() => import('../pages/Admin/Dashboard'));
const Mentor_mgt = lazy(() => import('../pages/Admin/Mentor_mgt'));
const Mentee_mgt = lazy(() => import('../pages/Admin/Mentee_mgt'));
const QA_mgt = lazy(() => import('../pages/Admin/QA_mgt'));
const AdminProtectLogin = lazy(() => import('../Utils/ProtectedRoute/AdminProtectLogin'));
import Spinner from '../components/Common/common4All/Spinner';
import InternalServer from '../pages/Error/InternalServer';
import NotFound from '../pages/Error/NotFound';


const AdminRoute: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
    <Route path='*' element={<NotFound/>} />
    <Route path='/500' element={<InternalServer/>}/>
      <Route path='/' element={<Admin_Page />} >

        <Route index path='dashboard' element={<AdminProtectLogin element={<Dashboard />} />} />
        <Route path='category_management' element={<AdminProtectLogin element={<Category_mgt />} />} />
        <Route path='mentor_management' element={<AdminProtectLogin element={<Mentor_mgt />} />}>

          <Route index path="verified" element={<AdminProtectLogin element={<Mentor_mgt />} />} />
          <Route path="not_verified" element={<AdminProtectLogin element={<Mentor_mgt />} />} />
        </Route>
        <Route path='mentee_management' element={<AdminProtectLogin element={<Mentee_mgt />} />} />
        <Route path='payment_management' element={<AdminProtectLogin element={<Category_mgt />} />} />
        <Route path='qa_management' element={<AdminProtectLogin element={<QA_mgt />} />} />
      </Route>
    </Routes>
  </Suspense>
)

export default AdminRoute
