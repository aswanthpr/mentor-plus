import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../Redux/store";
import { ROUTES } from "../../Constants/message";

const MentorProtectLogout: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = useSelector(
    (state: RootState) => state.menter?.mentorToken
  );
  const role = useSelector((state: RootState) => state.menter.mentorRole);

  useEffect(() => {
    if (accessToken && role === "mentor") {
      navigate(ROUTES?.MENTOR_HOME);
    }
  }, [accessToken, role, navigate]);

  return !accessToken || role !== "mentor" ? <Outlet /> : null;
};

export default MentorProtectLogout;
