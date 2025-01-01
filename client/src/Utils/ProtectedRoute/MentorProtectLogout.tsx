import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';


export interface IMentorLogout {
    element: React.ReactNode;
}
const MentorProtectLogout:React.FC<IMentorLogout> = ({element}) => {
    const navigate = useNavigate();
    const accessToken = useSelector((state: RootState) => state.menter.mentorToken);
    const role = useSelector((state: RootState) => state.menter.mentorRole);


    useEffect(() => {
        if (accessToken && role === 'mentor') {
            console.log("you are aleary logged in")
          navigate('/mentor/home');
        }
      }, [accessToken, role, navigate]);
    
    //   if (accessToken && role === 'mentee') return null; // or a loading spinner
    console.log("you are out.........")
    
      return element;
}

export default MentorProtectLogout