import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Auth/Button";
import { validatePassword, validateEmail } from "../../Validation/Validation";
import Spinner from "../../components/Common/common4All/Spinner";
import { useDispatch } from "react-redux";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { fetchAdminLogin } from "../../service/adminApi";
import bgImg from "../../Asset/background.jpg";
import { ADMIN_LOGIN_ERROR } from "../../Constants/initialStates";
import { ROUTES } from "../../Constants/message";
import { HttpStatusCode } from "axios";
import { setAuth } from "../../Redux/authSlice";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IError>(ADMIN_LOGIN_ERROR);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    []
  );
  const handlePassChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);

      if (emailError || passwordError) {
        setErrors({
          email: emailError || "",
          password: passwordError || "",
        });
        return;
      }

      setLoading(true);

      const response = await fetchAdminLogin(email, password);

      if (
        response?.data?.accessToken &&
        response?.status === HttpStatusCode?.Ok
      ) {
        dispatch(
          setAuth({ token: response.data?.accessToken, role: "admin" })
        );

        toast.success(response.data.message);
        navigate(ROUTES?.ADMIN_DASHBOARD);
      }

      setLoading((pre) => !pre);
    },
    [dispatch, email, navigate, password]
  );

  return (
    <div
      className="font-poppins flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {loading && <Spinner />}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">

        <h2 className="text-center text-3xl font-bold text-grey-900 mb-6">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-grey-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="w-full p-2 mt-2 border border-[#ff8800] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-grey-700"
            >
              Password
            </label>
            <input
              type={isVisible ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={handlePassChange}
              placeholder="Enter your password"
              className="w-full mt-2  p-2 border border-[#ff8800] rounded-md focus:outline-none focus:ring-2  focus:ring-[#ff8800] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setIsVisible((prev) => !prev)}
              aria-label={isVisible ? "Hide Password" : "Show Password"}
              className="absolute right-4 top-12 transform -translate-y-1/2 text-gray-400"
            >
              {isVisible ? <EyeClosedIcon /> : <EyeIcon />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}
          </div>
          <Button
            type="submit"
            variant="orange"
            children={"Login"}
            className="w-full py-2 mt-4 bg-[#ff8800] text-white font-extrabold rounded-md hover:bg-[#e07e00] transition-colors"
          />
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
