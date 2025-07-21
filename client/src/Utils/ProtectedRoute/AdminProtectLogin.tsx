import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { ROUTES } from '../../Constants/message';



const AdminProtectLogin:React.FC = () => {

    const navigate = useNavigate();
    const auth = useSelector((state: RootState) => state?.auth);

    useEffect(() => {
        if (!auth?.token || auth?.role !== 'admin') {
      
          navigate(ROUTES?.ADMIN_LOGIN);
        }
      }, [auth?.token, auth?.role, navigate]);
    
      // return element;
      return auth?.token && auth?.role === 'admin' ? <Outlet /> : null;
}

export default AdminProtectLogin