import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InternalServer from './pages/Error/InternalServer';
import NotFound from './pages/Error/NotFound';
import AuthRoute from './Routes/AuthRoute';
import MenteeRoute from './Routes/MenteeRoute';
import MentorRoute from './Routes/MentorRoute';
import AdminRoute from './Routes/AdminRoute';

// import Mentee_mgt from './pages/Admin/Mentee_mgt';
// import Explore from './pages/Mentee/Explore';


const App:React.FC=()=> {

  return (
   <>
 <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
    <Routes>
    <Route path="/*" element={<AuthRoute/>} />
    <Route path="admin/*" element={<AdminRoute/>} />
    <Route path="mentee/*" element={<MenteeRoute/>} />
    <Route path="mentor/*" element={<MentorRoute/>} />
    <Route path='500' element={<InternalServer/>}/>
    <Route path='*' element={<NotFound/>} />
 </Routes>
   </> 

  )
}

export default App
