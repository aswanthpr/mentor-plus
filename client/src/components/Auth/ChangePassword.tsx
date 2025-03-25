import React, { useCallback, useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import {
  validatePassword,
  validateConfirmPassword,
} from "../../Validation/Validation";
import { PASSWORD_ERROR_INITIAL } from "../../Constants/initialStates";

const ChangePassword: React.FC<IPassChange> = (props) => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<IPass>(PASSWORD_ERROR_INITIAL);

  // States to control password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prevState) => !prevState);
  }, []);

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = useCallback(() => {
    setIsConfirmPasswordVisible((prevState) => !prevState);
  }, []);
//password change
  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setErrors((pre) => ({
        ...pre,
        password: validatePassword(e.target.value),
      }));
    },
    []
  );
//set confirm pass
  const handleConfirmPassChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
    },
    []
  );
//validation for the field
  const validateForm = useCallback(() => {
    const passError = validatePassword(password);
    const confirmPassError = validateConfirmPassword(password, confirmPassword);

    setErrors({
      newPassword: passError,
      confirmPassword: confirmPassError,
    });

    return !passError && !confirmPassError;
  }, [confirmPassword, password]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (validateForm()) {
        props.onSubmit(password);
      }
    },
    [password, props, validateForm]
  );

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-black mb-6">Change Password</h2>

        <div className="relative">
          <InputField
            label="New Password"
            id="new_password"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            error={errors.newPassword}
            placeholder="Enter new Password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={isPasswordVisible ? "Hide Password" : "Show Password"}
            className="absolute right-4 top-12 transform -translate-y-1/2 text-gray-400"
          >
            {isPasswordVisible ? <EyeClosedIcon /> : <EyeIcon />}
          </button>
        </div>

        <div className="relative">
          <InputField
            label="Confirm Password"
            id="confirm_password"
            type={isConfirmPasswordVisible ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPassChange}
            error={errors.confirmPassword}
            placeholder="Confirm your Password"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            aria-label={
              isConfirmPasswordVisible ? "Hide Password" : "Show Password"
            }
            className="absolute right-4 top-12 transform -translate-y-1/2 text-gray-400"
          >
            {isConfirmPasswordVisible ? <EyeClosedIcon /> : <EyeIcon />}
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="orange"
          className="w-full font-bold"
          children="Change Password"
        />
      </form>
    </div>
  );
};

export default ChangePassword;
