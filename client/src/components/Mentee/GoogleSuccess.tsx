import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAccessToken } from '../../Redux/menteeSlice'
import Spinner from '../Common/common4All/Spinner';
import { toast } from 'react-toastify';
import { Messages, ROUTES } from '../../Constants/message';


const GoogleSuccess: React.FC = () => {
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get('token');
 

    if (token) {

      dispatch(setAccessToken({ accessToken: token, role: 'mentee' }));

      navigate(ROUTES?.MENTEE_HOME);
      toast.success(Messages?.SIGNUP_SUCCESS)


    } else {

      navigate(ROUTES?.MENTEE_LOGIN);

    }
    setLoading(false);
  }, [dispatch, navigate, location]);

  return (
    <div >
      {loading ? <Spinner /> : null}
    </div>
  );
};



export default GoogleSuccess;
