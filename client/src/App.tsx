import React from 'react'
import Landing from './pages/Landing/Landing';
import SignupForm from './pages/Auth/SignupForm'
import Login from './pages/Auth/Login'
import ForgotPassword from './pages/Auth/ForgotPassword'
import AdminLogin from './pages/Auth/AdminLogin'
import MentorApply from './pages/Auth/MentorApply'
import Mentee_Page from './pages/Mentee/Mentee_Page';
import Home from './pages/Mentee/Home';
import MenteeProfile from './pages/Mentee/MenteeProfile';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InternalServer from './pages/Error/InternalServer';
import NotFound from './pages/Error/NotFound';
import AuthRoute from './Routes/AuthRoute';
import MenteeRoute from './Routes/MenteeRoute';
import MentorRoute from './Routes/MentorRoute';

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
    <Route path="mentee/*" element={<MenteeRoute/>} />
    <Route path="mentor/*" element={<MentorRoute/>} />
    <Route path='500' element={<InternalServer/>}/>
    <Route path='*' element={<NotFound/>} />
 </Routes>
   </> 
//  <>
//       {/* <Landing/> */}
//       {/* <SignupForm/> */}
//       {/* <Login/> */}
//       {/* <ForgotPassword/> */}
//       {/* <AdminLogin/> */}
//       {/* <MentorApply/> */}
//       {/* <Mentee_Page/> */}
//       {/* <InternalServer/> */}
//       {/* <NotFound/> */}
//       {/* <Home/> */}
//       {/* <MenteeProfile/> */}
//       {/* <Explore/> */}
//       {/* <Mentee_mgt/> */}

//     </>
  )
}

export default App
