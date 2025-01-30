import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';


export interface IAdminLogin {
    element: React.ReactNode;
}
const AdminProtectLogin:React.FC<IAdminLogin> = ({element}) => {

    const navigate = useNavigate();
    const adminToken = useSelector((state: RootState) => state.admin.adminToken);
    const role = useSelector((state: RootState) => state.admin.adminRole);
    useEffect(() => {
        if (!adminToken && role !== 'admin') {
            console.log("you are aleary logged in")
          navigate('/auth/login/admin');
        }
      }, [adminToken, role, navigate]);
    

    console.log("admin out.........")
    
      return element;
}

export default AdminProtectLogin