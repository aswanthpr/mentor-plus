import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { routesObj } from '../../Constants/message';



const AdminProtectLogin:React.FC = () => {

    const navigate = useNavigate();
    const adminToken = useSelector((state: RootState) => state.admin.adminToken);
    const role = useSelector((state: RootState) => state.admin.adminRole);
    useEffect(() => {
        if (!adminToken && role !== 'admin') {
            console.log("you are aleary logged in")
          navigate(routesObj?.ADMIN_LOGIN);
        }
      }, [adminToken, role, navigate]);
    

    console.log("admin out.........")
    
      // return element;
      return adminToken && role === 'admin' ? <Outlet /> : null;
}

export default AdminProtectLogin