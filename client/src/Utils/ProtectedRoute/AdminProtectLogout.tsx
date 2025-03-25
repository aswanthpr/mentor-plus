
import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { routesObj } from '../../Constants/message';



const AdminProtectLogout:React.FC = () => {

    const navigate = useNavigate();
    const adminToken = useSelector((state: RootState) => state.admin?.adminToken);
    const role = useSelector((state: RootState) => state.admin?.adminRole);
    console.log(adminToken,role,'huauuuafjalsjdfl')
    useEffect(() => {
        if (adminToken && role === 'admin') {
            console.log("you are aleary logged in")
          navigate(routesObj?.ADMIN_DASHBOARD);
        }
      }, [adminToken, role, navigate]);
    
  
    console.log("admin out.........")
    
      return !adminToken && role !== 'admin' ? <Outlet /> : null;;
}

export default AdminProtectLogout 






