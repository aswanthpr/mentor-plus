import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Mentor_Page from '../pages/Mentor/Mentor_Page';
import MentorHome from '../pages/Mentor/MentorHome';
import MentorProfile from '../pages/Mentor/MentorProfile';
import MentorProtectLogin from '../Utils/ProtectedRoute/MentorProtectLogin';

const MentorRoute:React.FC= () => (
<Routes>
  <Route path='/'  element={<Mentor_Page/>} >
  {/* <Route index element={<Navigate to="home" />} /> */}
  <Route  path='/home' element={<MentorProtectLogin element={<MentorHome/>}/>}/>;
  <Route  path='/profile' element={<MentorProtectLogin element={<MentorProfile/>}/>}/>;
  </Route>
</Routes>
)


export default MentorRoute;