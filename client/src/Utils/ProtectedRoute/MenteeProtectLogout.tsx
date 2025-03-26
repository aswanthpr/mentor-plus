import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../Redux/store";
import { ROUTES } from "../../Constants/message";

const MenteeLogout: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = useSelector(
    (state: RootState) => state.mentee.accessToken
  );
  const role = useSelector((state: RootState) => state.mentee.role);

  useEffect(() => {
    if (accessToken && role === "mentee") {
      console.log("you are aleary logged in");
      navigate(ROUTES?.MENTEE_HOME);
    }
  }, [accessToken, role, navigate]);

  console.log("you are out.........");

  return !accessToken || role !== "mentee" ? <Outlet /> : null;
};

export default MenteeLogout;
