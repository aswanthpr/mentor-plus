
import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';



const AdminProtectLogout:React.FC<Iprotector> = ({element}) => {

    const navigate = useNavigate();
    const adminToken = useSelector((state: RootState) => state.admin?.adminToken);
    const role = useSelector((state: RootState) => state.admin?.adminRole);
    console.log(adminToken,role,'huauuuafjalsjdfl')
    useEffect(() => {
        if (adminToken && role === 'admin') {
            console.log("you are aleary logged in")
          navigate('/admin/dashboard');
        }
      }, [adminToken, role, navigate]);
    
  
    console.log("admin out.........")
    
      return element;
}

export default AdminProtectLogout 






