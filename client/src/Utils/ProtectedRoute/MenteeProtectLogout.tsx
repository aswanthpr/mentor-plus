import React,{useEffect,useState} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import Spinner from '../../components/Common/Spinner';


export interface IMenteeLogout {
    element: React.ReactNode;
}
const MenteeLogout: React.FC<IMenteeLogout> = ({ element }) => {

    const navigate = useNavigate();
    const accessToken = useSelector((state: RootState) => state.mentee.accessToken);
    const role = useSelector((state: RootState) => state.mentee.role);
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    useEffect(() => {
      
      if (accessToken && role === 'mentee') {
        console.log("you are aleary logged in")
        navigate('/mentee/home');
      }else{
        setIsLoading(false);
      }
    }, [accessToken, role, navigate]);
    
    if(isLoading){

      return (setTimeout(()=>{<Spinner/>},1000));

    }
      
    console.log("you are out.........")
    
      return element;
}

export default MenteeLogout;



