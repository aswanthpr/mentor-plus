import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';


const MentorProtectLogin:React.FC<Iprotector> = ({element}) => {
    const navigate = useNavigate();
    const accessToken = useSelector((state: RootState) => state.menter.mentorToken);
    const role = useSelector((state: RootState) =>state.menter.mentorRole);
  
  
    useEffect(() => {
      if (!accessToken || role !== 'mentor') {
        console.log("out.............")
        navigate('/auth/login/mentor');
      }
    }, [accessToken, role, navigate]);

    console.log("in................")
  
    return element;
}

export default MentorProtectLogin