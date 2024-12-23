import axios from "axios";
import React, { useState } from "react";
import { Github, Linkedin } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import Spinner from "../../components/Common/Spinner"; 
// import * as EmailValidator from 'email-validator';
import SocialLogins from "../../components/auth/SocialLogins";
import InputField from "../../components/Common/Form/InputField";
import OtpModal from "../../components/auth/OtpModal";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../../Validation/Validation";

interface IFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
interface IFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupForm:React.FC = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState<IFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<IFormErrors>({});
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [loading,setLoading]=useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log(e.target.value);
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error when user starts typing
    setErrors((prev: IFormErrors) => ({ ...prev, [id]: undefined }));
  };


  const validateField = (field: string, value: string) => {
    switch (field) {
      case "name":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(value, formData.password);
      default:
        return undefined;
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: IFormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      true;
      if (error) {
        newErrors[key as keyof IFormErrors] = error;
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try { 
        const response = await axios.post("http://localhost:3000/auth/signup", formData);
        console.log(response, "this is response");
        if (response.status == 200) {
          setLoading(false)
          setShowOtpModal(true);

          toast.success(response.data.message);
        
        } else {
          toast.error("Failed to send OTP");
        }
      } catch (error) {
        console.error("Error during signup", error);
      }finally{
        setLoading(false)
      }
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true)
    try{
    const {email} = formData;
    
    console.log("Verifying OTP:", otp,email);;
    const response = await axios.post('http://localhost:3000/auth/verify-otp',{email,otp});

    console.log(response,'this is the response',response.data)
    if(response.status==200){
      setLoading(true)
      toast.success(response.data.message);
      setShowOtpModal(false);
      navigate('/auth/login')
    }else{
      toast.error(response.data.message);
    }
  }catch(error:any){
    console.error("OTP verification failed:", error);
    toast.error("OTP verification failed. Please try again.");
  }finally{
    setLoading(true)
  }
  };

  const handleResendOtp = async()=>{
    try {
      const {email} = formData;
      const response = await axios.post('http://localhost:3000/auth/resend-otp',{email});
      if(response.status == 200){
        toast.success(response.data.message||'OTP resend successfull')
      }else{
        toast.error("Failed to resend OTP");
      }
    } catch (error:any) {
       console.error('error resending otp ',error)
       toast.error('Error resending OTP. Please try again.')
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {loading && <Spinner />}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign up as mentee 
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <SocialLogins
              icon={Github}
              provider=" GitHub"
              onClick={() => handleSocialLogin("GitHub")}
            />
            <SocialLogins
              icon={Linkedin}
              provider=" LinkedIn"
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
              <span className="text-sm font-medium">Continue with Google</span>
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
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

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <InputField
              label="Full Name"
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
            <InputField
              label="Email address"
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <InputField
              label="Password"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <InputField
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff8800]"
              >
                Sign up
              </button>
            </div>
          </form>

          <div className="mt-6 space-y-4">
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="font-medium text-[#ff8800] hover:text-[#ff9900]"
              >
                Sign in
              </a>
            </p>
            <p className="text-sm text-center text-gray-600">
              Looking to join us as a mentor?
              <a
                href="/auth/apply_as_mentor"
                className="font-medium text-[#ff8800] hover:text-[#ff9900]"
              >
                Apply now
              </a>
            </p>
          </div>

          <p className="mt-6 text-xs text-center text-gray-500">
            By signing up, you agree to our{" "}
            <a href="#" className="text-[#ff8800] hover:text-[#ff9900]">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#ff8800] hover:text-[#ff9900]">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        onResendOtp={handleResendOtp}
      />
    </div>
  );
};

export default SignupForm;
