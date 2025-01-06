import React from 'react';
import { Route, Routes,Navigate } from 'react-router-dom';
import Mentee_Page from '../pages/Mentee/Mentee_Page';
import Home from '../pages/Mentee/Home';
import MenteeProfile from '../pages/Mentee/MenteeProfile';
import MenteeLogin from '../Utils/ProtectedRoute/MenteeProtectLogin';
import Explore from '../pages/Mentee/Explore';
import QnA_page from '../pages/Mentee/QnA_page';

import GoogleSuccess from '../components/Mentee/GoogleSuccess';
import QuestionsPage from '../components/Mentee/QuestionsPage';
import GoogleFailure from '../components/Mentee/GoogleFailure';

const MenteeRoute:React.FC = () => (
<Routes>

    <Route path="/" element={<Mentee_Page/>}>
    <Route index element={<Navigate to="/home" />} />
    <Route path='/home' element={<MenteeLogin element={<Home/>} />} />
    <Route path='/profile' element={<MenteeLogin element={<MenteeProfile />} />} />
    <Route path='/explore' element={<MenteeLogin element={<Explore/>}/>}/>
    <Route path='/bookings' element={<MenteeLogin element={<QuestionsPage/>}/>}/>
    <Route path='/qa' element={<MenteeLogin element={<QnA_page/>}/>}/>
    <Route path='/google/success' element={<GoogleSuccess/>}/>
    <Route path='/google/failure' element={<GoogleFailure/>}/>

   </Route>

</Routes>
  )

export default MenteeRoute
