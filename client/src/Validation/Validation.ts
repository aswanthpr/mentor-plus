import * as EmailValidator from "email-validator";

//name validation
export const validateName = (name: string): string | undefined => {
  if (name.length < 4 && name.length <= 25) {
    return "Name must be at least 3-25 characters long";
  }
  if (!/^[a-zA-Z\s]*$/.test(name)) {
    return "Name can only contain letters and spaces";
  }
  return undefined;
};



// email validation
export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return "Email is required";
  }
  const emailRegex = /^[a-z0-9][\w\.]+\@\w+?(\.\w+){1,}$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  if (!EmailValidator.validate(email)) {
    return "Please enter a valid email address";
  }

  return undefined;
};


//validation password
export const validatePassword = (password: string): string | undefined => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  if (password.length < 7 || !password) {
    return "Password must be at least 6 characters long";
  }
  if (!passwordRegex.test(password)) {
    return "Password must contain at least one letter, one number, and one special character.";
  }

  return undefined;
};



//confirm password validation

export const validateConfirmPassword = (
  confirmPassword: string,
  password: string
): string | undefined => {
  if (password === undefined || confirmPassword === undefined) {
    console.log('Password or confirmPassword is undefined');
    return "Passwords are required";
  }

  if (password!== confirmPassword) {
    console.log('Passwords do not match:', { password, confirmPassword });
    return "Passwords do not match";
  }

  return undefined;
};
