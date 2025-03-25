import React,{useEffect,useState} from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import Spinner from '../../components/Common/common4All/Spinner';
import { routesObj } from '../../Constants/message';


const MenteeLogout: React.FC = () => {

    const navigate = useNavigate();
    const accessToken = useSelector((state: RootState) => state.mentee.accessToken);
    const role = useSelector((state: RootState) => state.mentee.role);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
      
      if (accessToken && role === 'mentee') {
        console.log("you are aleary logged in")
        navigate(routesObj?.MENTEE_HOME);
      }else{
        setIsLoading(false);
      }
    }, [accessToken, role, navigate]);
    
    if(isLoading){

      return (<Spinner/>);

    }
      
    console.log("you are out.........")
    
      return !accessToken && role !== 'mentee' ? <Outlet /> : null;;
}

export default MenteeLogout;



