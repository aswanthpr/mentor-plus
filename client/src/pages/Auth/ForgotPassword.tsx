import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import InputField from "../../components/Auth/InputField";
import Button from "../../components/Auth/Button";
import OtpInput from "../../components/Auth/OtpInput";
import { useTimer } from "../../Hooks/useTime";
import { validateEmail } from "../../Validation/Validation";
import ChangePassword from "../../components/Auth/ChangePassword";
import Modal from "../../components/Common/common4All/Modal";
import Spinner from "../../components/Common/common4All/Spinner";
import { toast } from "react-toastify";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import {
  fetchForgotPassOtpVerify,
  fetchForgotPassSendOtp,
  fetchForgotPassword,
  forgetPasswordResendOtp,
} from "../../service/commonApi";
import bgImg from "../../Asset/background.jpg";

const ForgetPassword: React.FC = () => {
  const { user } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { seconds, isActive, restart } = useTimer(60);

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const email_Value = e.target.value;
    setEmail(email_Value);

    const emailValid = validateEmail(email_Value);
    setEmailError(emailValid || null);
  };

  const handleSendOTP = async () => {
    try {
      if (validateEmail(email) != undefined) {
        setEmailError("Please enter a valid email address before sending OTP");
        return;
      }
      setEmailError("");
      setLoading(true);

      const response = await fetchForgotPassSendOtp(email, user as string);

      if (response?.status == 200 && response?.data?.success) {
        toast.success(`${response?.data?.message}`);
        setIsOtpSent(true);
        restart();
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await forgetPasswordResendOtp(email);

      if (response.data?.success) {
        toast.success(response.data?.message);
        setIsOtpSent(true);
        restart();
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleVerify = async () => {
    try {
      if (otp.length !== 6) {
        setOtpError("Please enter a valid 6-digit OTP");
        return;
      }
      setOtpError(null);
      setLoading(true);

      const response = await fetchForgotPassOtpVerify(email, otp);

      console.log(response?.data && response?.status);

      if (response?.status == 200 && response?.data?.success) {
        setLoading(false);
        toast.success(response?.data?.message);
        setIsModalOpen(true);
        setOtp("");
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  const handlePassChange = async (password: string) => {
    try {
      setLoading(true);
      console.log("password  changed", password);
      setIsModalOpen(false);

      const response = await fetchForgotPassword(
        user as string,
        email,
        password
      );

      console.log(response?.data.message, response?.status);
      if (response?.status == 200 && response.data?.success) {
        toast.success(response.data?.message);
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      navigate("/auth/login/mentee");
    }
  };

  return (
    <div
      className={"min-h-screen bg-gray-50 flex items-center justify-center p-4"}
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {loading && <Spinner />}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-black text-center mb-8">
          Forgot Password
        </h1>
        <div className="space-y-6  ">
          <div className="flex gap-4  items-center">
            <InputField
              type={"email"}
              id={"email"}
              placeholder={"Enter your email"}
              value={email}
              onChange={handleEmailInput}
              required={true}
              className="flex-1"
              error={emailError || undefined}
            />

            <Button
              variant="orange"
              onClick={handleSendOTP}
              disabled={!email || isOtpSent}
              children={loading ? <Spinner /> : "Verify"}
              className="flex-shrink-0"
            />
          </div>
          {isOtpSent && (
            <>
              <OtpInput value={otp} onChange={setOtp} />
              {otpError && (
                <p className="text-sm text-orange-400">{otpError}</p>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-grey-600">
                  Time remaing:
                  {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                  {String(seconds % 60).padStart(2, "0")}
                </span>
                <Button
                  variant="secondary"
                  onClick={handleResendOTP}
                  disabled={isActive}
                  children={"Resend OTP"}
                />
              </div>
              <Button
                className="w-full font-bold"
                onClick={handleVerify}
                disabled={otp.length !== 6}
                variant="orange"
                children={"Submit"}
              />
            </>
          )}
          <div className="text-left">
            {" "}
            {/* Center alignment */}
            <button
              onClick={() => navigate(-1)}
              className=" ml-1 text-sm hover:text-[#000000] text-[#ff9900] font-semibold"
            >
              Back
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        children={<ChangePassword onSubmit={handlePassChange} />}
      />
    </div>
  );
};

export default ForgetPassword;
