import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';


export interface IMenteeLogout {
    element: React.ReactNode;
}
const MenteeLogout: React.FC<IMenteeLogout> = ({ element }) => {

    const navigate = useNavigate();
    const accessToken = useSelector((state: RootState) => state.mentee.accessToken);
    const role = useSelector((state: RootState) => state.mentee.role);


    useEffect(() => {
        if (accessToken && role === 'mentee') {
            console.log("you are aleary logged in")
          navigate('/mentee/home');
        }
      }, [accessToken, role, navigate]);
    
    //   if (accessToken && role === 'mentee') return null; // or a loading spinner
    console.log("you are out.........")
    
      return element;
}

export default MenteeLogout;