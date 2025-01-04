import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { unAPI } from "../../Config/adminAxios";
import Button from "../../components/Common/Form/Button";
import { validatePassword, validateEmail } from "../../Validation/Validation";
import Spinner from "../../components/Common/Spinner";
import { useDispatch } from "react-redux";
import { setToken } from "../../Redux/adminSlice";
import { EyeClosedIcon, EyeIcon } from "lucide-react";


interface IError {
  email: string | undefined;
  password: string | undefined;
}
const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVisible,setIsVisible]=useState<boolean>(false)
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IError>({
    email: "",
    password: "",
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
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

      const response = await unAPI.post(`/auth/login/admin`, {
        email,
        password,
      });

      if (response.data.success && response.status === 200) {

        dispatch(setToken({adminToken:response.data.accessToken,adminRole:'admin'}));
        setLoading(false);
        toast.success(response.data.message);
        navigate("/admin/dashboard");

      } else {
        setLoading(false);
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        toast.error(message || "Login failed. Please check your credentials.");
      } else {
        // Handle network or unexpected errors
        toast.error("An unexpected error occurred. Please try again.");
      }
    }finally{
      setTimeout(()=>{
        setLoading(false)

      },500)
    }
  };

  return (
    <div className="font-poppins flex items-center justify-center min-h-screen bg-gray-100">
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
              type={isVisible?"text":"password"}
             
              id="password"
              name="password"
              value={password}
              onChange={handlePassChange}
              placeholder="Enter your password"
              className="w-full mt-2  p-2 border border-[#ff8800] rounded-md focus:outline-none focus:ring-2  focus:ring-[#ff8800] focus:border-transparent"
            />
             <button
            type="button"
            onClick={()=>setIsVisible((prev)=>!prev)}
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
        {/* <div className='text-center mt-4'>
        <a href="#"
        className='text-black font-bold text-sm hover:underline'>Forgot Password?
        </a>

    </div> */}
      </div>
    </div>
  );
};

export default AdminLogin;
