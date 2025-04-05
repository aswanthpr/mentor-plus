import React, { useState, useEffect, useCallback } from "react";
import InputField from "./InputField";
import { validate_Otp } from "../../Validation/Validation";

const OtpModal: React.FC<IModalProps> = (props) => {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (props.isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => {
      clearInterval(interval);
    };
  }, [props.isOpen, timer]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const validateOtp = validate_Otp(otp);
   if(validateOtp?.length!=0){
    setError(validateOtp);
   }
    setError("");
    props.onVerify(otp);
  },[otp, props]);
  
  const handleResendOtp = useCallback(() => {
    setOtp("");
    setTimer(60);
    setCanResend(false);
    props.onResendOtp();
  },[props]);

  if (!props.isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Verify OTP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Enter OTP"
            type="text"
            id="otp"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.slice(0, 6);
              if (/^\d*$/.test(value)) {
                setOtp(value);
                setError(undefined!);
              }
            }}
            error={error as string}
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Time remaining: {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={handleResendOtp}
              className={` text-white ${
                canResend
                  ? " text-[#f89d14] "
                  : "text-gray-700 cursor-not-allowed"
              }`}
              disabled={!canResend}
            >
              Resend OTP
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={props.onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#ff8800] text-white rounded-lg hover:bg-[#ff9900] transition-colors"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpModal;
