import React from 'react'
import { Routes,Route,Navigate } from 'react-router-dom'

import Mentor_Page from '../pages/Mentor/Mentor_Page'

const MentorRoute:React.FC= () => (
<Routes>
  <Route path='/'  element={<Mentor_Page/>} >
  {/* <Route index element={<Navigate to="home" />} /> */}

  </Route>
</Routes>
)


export default MentorRoute