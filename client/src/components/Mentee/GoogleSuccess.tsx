import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "../Common/common4All/Spinner";
import { toast } from "react-toastify";
import { Messages, ROUTES } from "../../Constants/message";
import { setAuth } from "../../Redux/authSlice";
import { setUser } from "../../Redux/userSlice";

const GoogleSuccess: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    console.log(urlParams, "paramsraisndnflkasndf");
    const token = urlParams.get("token");
    const name = urlParams.get("name") as string;
    const email = urlParams.get("email") as string;
    const image = urlParams.get("image") as string;
    
    dispatch(setUser({ name, email, image, role: "mentee" }));
    if (token) {
      dispatch(setAuth({ token: token, role: "mentee" }));

      navigate(ROUTES?.MENTEE_HOME);
      toast.success(Messages?.SIGNUP_SUCCESS);
    } else {
      navigate(ROUTES?.MENTEE_LOGIN);
    }
    setLoading(false);
  }, [dispatch, navigate, location]);

  return <div>{loading ? <Spinner /> : null}</div>;
};

export default GoogleSuccess;
