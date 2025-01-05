import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAccessToken } from '../../Redux/menteeSlice'
import Spinner from '../Common/Spinner';

const GoogleSuccess:React.FC = () => {
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const location = useLocation();
 const dispatch = useDispatch()

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    console.log(location.search)

    if (token) {

      dispatch(setAccessToken({accessToken:token,role:'mentee'}));

        navigate('/mentee/home');


    } else {

      navigate('/auth/login/mentee');
    }

    setLoading(false); 
    
  }, [dispatch, navigate, location]);

  return (
    <div >
      {loading ? <Spinner/>: null}
    </div>
  );
};


export default GoogleSuccess;
