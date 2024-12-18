import React, { useState } from "react";
import { Github, Linkedin } from "lucide-react";
import axios from 'axios';
import Spinner from "../../components/Common/Spinner";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/Common/Form/InputField";
import SocialLogins from "../../components/auth/SocialLogins";
import {validateEmail,validatePassword} from "../../Validation/Validation";
import {toast} from 'react-toastify';


type UserType = "mentee" | "mentor";

interface LoginFormData {
  email: string;
  password: string;
}
interface LoginFormError {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [userType, setUserType] = useState<UserType>("mentee");
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormError>({});
  const [loading,setLoading]=useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((pre) => ({ ...pre, [id]: undefined }));
  };

  const validateField = (
    field: keyof LoginFormData,
    value: string
  ): string | undefined => {
    switch (field) {
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      default:
        return undefined;
    }
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
try{
    const newErrors: LoginFormError = {};
    (Object.keys(formData) as Array<keyof LoginFormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);

    if(Object.keys(newErrors).length===0){
      setLoading(true)
      if(userType=='mentee'){
        console.log('hiaii',formData)
        
        const response = await axios.post('http://localhost:3000/auth/login',{formData})
        console.log(response,'response from mentee login')
        if(response.status==200){
         toast.success(response.data.message);
          setLoading(false)

          navigate('/mentee/home');
        }
      }else{
        console.log('this is mentor');

      }

    }
  }catch(error:any){
    console.log(error,'while login submit');
  }finally{
    setLoading(false)
  }
  };

const handleSocialLogin = (provider:string)=>{

    console.log("loging in as ",provider)
}
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-poppins">
      {loading&&<Spinner/>}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-bold text-black mb-8">
          Login
        </h2>
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setUserType("mentee")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              userType === "mentee"
                ? "bg-[#ff8800] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            I'm a Mentee
          </button>
          <button
            onClick={() => setUserType("mentor")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              userType === "mentor"
                ? "bg-[#ff8800] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            I'm a Mentor
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {userType === "mentee" && (
            <div className="space-y-4 mb-8">
              <SocialLogins
                icon={Github}
                provider="GitHub"
                onClick={() => handleSocialLogin("GitHub")}
              />
              <SocialLogins
                icon={Linkedin}
                provider="LinkedIn"
                onClick={() => handleSocialLogin("LinkedIn")}
              />
              <button
                onClick={() => handleSocialLogin("Google")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">
                  Continue with Google
                </span>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Email address"
              type="email"
              id="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <InputField
              label="Password"
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff8800]"
            >
              Login
            </button>
          </form>

          <div className="mt-6 flex flex-col  items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex gap-2 text-sm ">
              <a
                href="/auth/signup"
                className="text-[#ff8800] hover:text-[#ff9900] font-medium"
              >
                Sign up as a mentee
              </a>
              <span className="text-gray-500">or</span>
              <a
                href="/auth/apply_as_mentor"
                className="text-[#ff8800] hover:text-[#ff9900] font-medium"
              >
                apply to be a mentor
              </a>
            </div>
         

<a
    href="/auth/forgot_password"
    className="text-[#ff8800] hover:text-[#ff9900] text-sm font-medium"
  >
    Forgot password?
  </a>

            
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Login;
