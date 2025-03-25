import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {  Outlet, useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { routesObj } from '../../Constants/message';


const MentorProtectLogin:React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useSelector((state: RootState) => state.menter.mentorToken);
    const role = useSelector((state: RootState) =>state.menter.mentorRole);
  
  
    useEffect(() => {
      if (!accessToken || role !== 'mentor') {
        console.log("out.............")
        navigate(routesObj?.MENTOR_LOGIN);
      }
    }, [accessToken, role, navigate]);

    console.log("in................")
  
    return accessToken && role === 'mentor' ? <Outlet /> : null;;
}

export default MentorProtectLogin