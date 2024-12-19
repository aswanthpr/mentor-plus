import React, { useState } from "react";
import InputField from "../Common/Form/InputField";
import Button from "../Common/Form/Button";
import { validatePassword, validateConfirmPassword } from "../../Validation/Validation";
// import { validate } from "email-validator";
validatePassword;

interface IPassChange {
  onSubmit: (password: string) => void;
}
interface Ipass{
    password:string|undefined;
    confirmPassword:string|undefined;
}
const ChangePassword: React.FC<IPassChange> = (props) => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<Ipass>({
    password:"",
    confirmPassword: "",
  });

const handlePasswordChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setPassword(e.target.value);
    setErrors((pre)=>({...pre,password:validatePassword(e.target.value)}))
}

const handleConfirmPassChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
  setConfirmPassword(e.target.value);
    
}

const validateForm = () => {
  const passError = validatePassword(password);
  const confirmPassError = validateConfirmPassword(password, confirmPassword);
  
  setErrors({
    password: passError,
    confirmPassword: confirmPassError,
  });

  return !passError && !confirmPassError; 
};


const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (validateForm()) {
    props.onSubmit(password);
  }
};

  return(
    <div >

  <form onSubmit={handleSubmit} className="space-y-4">
    <h2 className="text-2xl font-bold text-black mb-6">
        Change Password
    </h2>
    <InputField
    label="New Password"
    id="new_passoword"
    type={'password'}
    value={password}
    onChange={handlePasswordChange}
    error={errors.password}
    placeholder="Enter new Password"
    />

<InputField
    label="Confirm Password"
    id="confirm_password"
    type={'password'}
    value={confirmPassword}
    onChange={handleConfirmPassChange}
    error={errors.confirmPassword}
    placeholder="Enter new Password"
    />

    <Button
    type="submit"
    variant="orange"
    className="w-full font-bold"
    children={'Change Password'}
    />
  </form>
    </div>
  )
};

export default ChangePassword;
