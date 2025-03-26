import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Common/common4All/Spinner";
import { toast } from "react-toastify";
import { Messages, ROUTES } from "../../Constants/message";

const GoogleFailure: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    navigate(ROUTES?.MENTEE_LOGIN);
    toast.error(Messages?.GOOGLE_AUTH_FAIL_MESSAGE)

    setLoading(false);

  }, [navigate]);

  return <div>{loading ? <Spinner /> : null}</div>;
};

export default GoogleFailure;
