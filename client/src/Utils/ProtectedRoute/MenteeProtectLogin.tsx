import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';


interface PrivateRouteProps {
  element: React.ReactNode;

}
const MenteeLogin: React.FC<PrivateRouteProps> = ({ element }) => {

  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.mentee.accessToken);
  const role = useSelector((state: RootState) => state.mentee.role);


  useEffect(() => {
    if (!accessToken || role !== 'mentee') {
      console.log("out.............")
      navigate('/auth/login/mentee');
    }
  }, [accessToken, role, navigate]);

  // if (!accessToken || role !== 'mentee') return null; // or return a loading spinner
  console.log("in................")

  return element;
};



export default MenteeLogin