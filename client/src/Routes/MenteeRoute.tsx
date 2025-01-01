import React from 'react';
import { Route, Routes,Navigate } from 'react-router-dom';
import Mentee_Page from '../pages/Mentee/Mentee_Page';
import Home from '../pages/Mentee/Home';
import MenteeProfile from '../pages/Mentee/MenteeProfile';
import MenteeLogin from '../Utils/ProtectedRoute/MenteeProtectLogin';
import Explore from '../pages/Mentee/Explore';

const MenteeRoute:React.FC = () => (
<Routes>

    <Route path="/" element={<Mentee_Page/>}>
    <Route index element={<Navigate to="/home" />} />
    <Route path='/home' element={<MenteeLogin element={<Home/>} />} />
    <Route path='/profile' element={<MenteeLogin element={<MenteeProfile />} />} />
    <Route path='/explore' element={<MenteeLogin element={<Explore/>}/>}/>

   </Route>

</Routes>
  )

export default MenteeRoute
