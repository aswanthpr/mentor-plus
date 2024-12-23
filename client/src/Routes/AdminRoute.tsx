import React from 'react';
import { Navigate, Route,Routes } from 'react-router-dom';
import Admin_Page from '../pages/Admin/Admin_Page';
import Category_mgt from '../pages/Admin/Category_mgt'
import Dashboard from '../pages/Admin/Dashboard';
import Mentor_mgt from '../pages/Admin/Mentor_mgt';
import Mentee_mgt from '../pages/Admin/Mentee_mgt';
import QA_mgt from '../pages/Admin/QA_mgt';

const AdminRoute:React.FC = () =>  (
   <Routes>
  <Route path='/' element={<Admin_Page/>} >
  <Route index element={<Navigate to='dashboard'/>}/>
  <Route  path='dashboard' element={<Dashboard/>} />
  <Route path='category_management' element={<Category_mgt/>}/>
  <Route path='mentor_management' element={<Mentor_mgt/>}/>
  <Route path='mentee_management' element={<Mentee_mgt/>}/>
  <Route path='payment_management' element={<Category_mgt/>}/>
  <Route path='qa_management' element={<QA_mgt/>}/>
  </Route>
   </Routes>
  )

export default AdminRoute
