import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../Redux/store";
import { ROUTES } from "../../Constants/message";

const MenteeLogin: React.FC = () => {
  const navigate = useNavigate();

  const accessToken = useSelector(
    (state: RootState) => state.mentee.accessToken
  );
  const role = useSelector((state: RootState) => state.mentee.role);

  useEffect(() => {

    if (!accessToken || role !== "mentee") {
    
      navigate(ROUTES?.MENTEE_LOGIN);
    }

  }, [accessToken, role, navigate]);



  return accessToken && role === 'mentee' ? <Outlet /> : null;
};

export default MenteeLogin;
