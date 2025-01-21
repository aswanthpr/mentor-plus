import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthRoute from './Routes/AuthRoute';
import MenteeRoute from './Routes/MenteeRoute';
import MentorRoute from './Routes/MentorRoute';
import AdminRoute from './Routes/AdminRoute';


const App:React.FC=()=> {

  return (
   <>
   <BrowserRouter>
 <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
    <Routes>
    <Route path="/*" element={<AuthRoute/>} />
    <Route path="admin/*" element={<AdminRoute/>} />
    <Route path="mentee/*" element={<MenteeRoute/>} />
    <Route path="mentor/*" element={<MentorRoute/>} />

 </Routes>
 </BrowserRouter>
   </> 

  )
}

export default App
