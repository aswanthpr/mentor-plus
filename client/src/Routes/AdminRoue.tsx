import React from 'react';
import { Route,Routes } from 'react-router-dom';
import Admin_Page from '../pages/Admin/Admin_Page';

const AdminRoue:React.FC = () =>  (
   <Routes>
  <Route path='/' element={<Admin_Page/>} >

  </Route>
   </Routes>
  )

export default AdminRoue