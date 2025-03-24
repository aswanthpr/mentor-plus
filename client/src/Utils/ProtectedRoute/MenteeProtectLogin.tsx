import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../Redux/store";
import Spinner from "../../components/Common/common4All/Spinner";

const MenteeLogin: React.FC<Iprotector> = ({ element }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useSelector(
    (state: RootState) => state.mentee.accessToken
  );
  const role = useSelector((state: RootState) => state.mentee.role);
console.log(role,accessToken,'thi9s is hte token')
  useEffect(() => {

    if (!accessToken || role !== "mentee") {
      console.log("out.............");
      navigate("/auth/login/mentee");
    } else {
      setIsLoading(false);
    }

  }, [accessToken, role, navigate]);

  if (isLoading) {
    return <Spinner/>;
  }

  console.log("in................");

  return element;
};

export default MenteeLogin;
