import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Common/Spinner";
import { toast } from "react-toastify";

const GoogleFailure: React.FC = () => {
    const navigate = useNavigate()
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    navigate("/auth/login/mentee");
toast.error('This email is already registered with a different provider')
    setLoading(false);
  }, []);

  return <div>{loading ? <Spinner /> : null}</div>;
};

export default GoogleFailure;
