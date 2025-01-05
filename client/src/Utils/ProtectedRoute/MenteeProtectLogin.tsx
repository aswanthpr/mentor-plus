import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../Redux/store";
import Spinner from "../../components/Common/Spinner";

interface PrivateRouteProps {
  element: React.ReactNode;
}
const MenteeLogin: React.FC<PrivateRouteProps> = ({ element }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useSelector(
    (state: RootState) => state.mentee.accessToken
  );
  const role = useSelector((state: RootState) => state.mentee.role);

  useEffect(() => {

    if (!accessToken || role !== "mentee") {
      console.log("out.............");
      navigate("/auth/login/mentee");
    } else {
      setIsLoading(false);
    }

  }, [accessToken, role, navigate]);

  if (isLoading) {
    return (setTimeout(()=>{<Spinner/>},1000));
  }

  console.log("in................");

  return element;
};

export default MenteeLogin;
