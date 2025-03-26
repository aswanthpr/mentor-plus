
import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { ROUTES } from '../../Constants/message';



const AdminProtectLogout:React.FC = () => {

    const navigate = useNavigate();
    const adminToken = useSelector((state: RootState) => state.admin?.adminToken);
    const role = useSelector((state: RootState) => state.admin?.adminRole);

    useEffect(() => {
        if (adminToken && role === 'admin') {
            console.log("you are aleary logged in")
          navigate(ROUTES?.ADMIN_DASHBOARD);
        }
      }, [adminToken, role, navigate]);
    
  
    console.log("admin out.........")
    
      return !adminToken || role !== 'admin' ? <Outlet /> : null;;
}

export default AdminProtectLogout 






