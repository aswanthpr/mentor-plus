import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { ROUTES } from '../../Constants/message';



const AdminProtectLogin:React.FC = () => {

    const navigate = useNavigate();
    const adminToken = useSelector((state: RootState) => state.admin?.adminToken);
    const role = useSelector((state: RootState) => state.admin?.adminRole);
    useEffect(() => {
        if (!adminToken || role !== 'admin') {
      
          navigate(ROUTES?.ADMIN_LOGIN);
        }
      }, [adminToken, role, navigate]);
    

    
      // return element;
      return adminToken && role === 'admin' ? <Outlet /> : null;
}

export default AdminProtectLogin