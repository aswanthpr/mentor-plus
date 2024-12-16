import React from 'react';
import { Route, Routes,Navigate } from 'react-router-dom';
import Mentee_Page from '../pages/Mentee/Mentee_Page';
import Home from '../pages/Mentee/Home';
import MenteeProfile from '../pages/Mentee/MenteeProfile';

const MenteeRoute:React.FC = () => (
<Routes>
    <Route path="/" element={<Mentee_Page/>}>
    <Route index element={<Navigate to="home" />} />
    <Route  path='home' element={<Home/>} />
    <Route path='profile' element={<MenteeProfile/>} />

   </Route>
</Routes>
  )


export default MenteeRoute