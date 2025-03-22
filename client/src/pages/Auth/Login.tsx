import React, { useCallback, useState } from "react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


import { AppDispatch } from "../../Redux/store";
import { setAccessToken } from "../../Redux/menteeSlice";
import { setMentorToken } from "../../Redux/mentorSlice";
import { fetchMenteeLogin } from "../../service/menteeApi";
import { fetchMentorLogin } from "../../service/mentorApi";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import InputField from "../../components/Auth/InputField";
import Spinner from "../../components/Common/common4All/Spinner";
import { validateEmail, validatePassword } from "../../Validation/Validation";
import bgImg from "../../Asset/background.jpg"
const Login: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormError>({});
  const [loading, setLoading] = useState<boolean>(false);

  const getActivePath = useCallback((path: string) => {
    if (path.includes("mentor")) {
      return "mentor";
    }
    return "mentee";
  }, []);

  const [userType, setUserType] = useState<IUserType>(
    getActivePath(location.pathname)
  );

  const handleUserTypeChange = useCallback(
    (type: IUserType) => {
      setUserType(type);
      navigate(`/auth/login/${type}`); // Update the URL based on the selected user type
    },
    [navigate]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((pre) => ({ ...pre, [id]: undefined }));
  }, []);

  const validateField = useCallback(
    (field: keyof LoginFormData, value: string): string | undefined => {
      switch (field) {
        case "email":
          return validateEmail(value);
        case "password":
          return validatePassword(value);
        default:
          return undefined;
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        const newErrors: LoginFormError = {};
        (Object.keys(formData) as Array<keyof LoginFormData>).forEach((key) => {
          const error = validateField(key, formData[key]);
          if (error) {
            newErrors[key] = error;
          }
        });
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
          if (userType == "mentee") {
            const response = await fetchMenteeLogin(formData);

            if (response?.status == 200 && response?.data?.accessToken) {
              dispatch(
                setAccessToken({
                  accessToken: response.data?.accessToken,
                  role: "mentee",
                })
              );

              toast.success(response.data.message);

              navigate("/mentee/home");
            }else{
             
                console.log(response,";aksjdjfk")
                toast.error(response?.data?.message)
            
            }
          }
          if (userType == "mentor") {
            setLoading(true);
            const response = await fetchMentorLogin(formData);

            if (response.status == 200 && response.data.success) {
              dispatch(
                setMentorToken({
                  mentorToken: response.data?.accessToken,
                  mentorRole: "mentor",
                })
              );
              console.log(
                response.data?.accessToken,
                "thsi is from redux",
                response.data
              );

              navigate("/mentor/home");
            }
            toast.success(response.data.message);
          }
         
        }
      } catch (error: unknown) {
        errorHandler(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    },
    [dispatch, formData, navigate, userType, validateField]
  );

  const handleSocialLogin = useCallback(async (provider: string) => {
    if (provider === "google") {
      window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-poppins"
    style={{
      backgroundImage: `url(${bgImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
    >
      {loading && <Spinner />}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-bold text-black mb-8">
          Login
        </h2>
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => handleUserTypeChange("mentee")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              userType === "mentee"
                ? "bg-[#ff8800] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            I'm a Mentee
          </button>
          <button
            onClick={() => handleUserTypeChange("mentor")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
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
              <button
                onClick={() => handleSocialLogin("google")}
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
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <div className="relative">
              <InputField
                label="Password"
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((pre) => !pre)}
                aria-label={
                  isPasswordVisible ? "Hide Password" : "Show Password"
                }
                className="absolute right-4 top-12 transform -translate-y-1/2 text-gray-400" 
              >
                {isPasswordVisible ? <EyeClosedIcon /> : <EyeIcon />}
              </button>
            </div>
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

            <Link
              to={`/auth/forgot_password/${userType}`}
              className="text-[#ff8800] hover:text-[#ff9900] text-sm font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
