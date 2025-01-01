import * as EmailValidator from "email-validator";


//name validation
export const validateName = (name: string): string | undefined => {
  if (name.length < 4 || name.length > 25) {
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

export const categoryValidation = async (category: string): Promise<boolean> => {
  if (!category) {
    return false;
  }
  const regex = /^[a-zA-Z\s]{3,20}$/;
  return regex.test(category);
};

export const validatePhone=(phone:string)=>{

  const phonePattern = /^[0-9]{10,}$/; 
  if (phone && !phonePattern.test(phone)) {
   return "Phone number must be at least 10 digits and contain only numbers.";
  }
return undefined
}

// export const validateBio=(bio:string)=>{
//   if (bio && (bio.length < 20 || bio.length > 200)) {
//     return "Bio must be between 20 and 200 characters.";
//   }
// return undefined
// }




// Email validation (only 1 '@' allowed)
export const validateEmails = (email: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    return "Email is required.";
  }
  if (!emailPattern.test(email)) {
    return "Invalid email format.";
  }
  const atCount = (email.match(/@/g) || []).length;
  if (atCount > 1) {
    return "Email cannot contain multiple '@' symbols.";
  }
  return "";
};

// Phone validation (only digits, 10 characters)
export const validatePhones = (phone: string) => {
  const phonePattern = /^[0-9]{10}$/;
  if (!phone) {
    return "Phone number is required.";
  }
  if (!phonePattern.test(phone)) {
    return "Phone number must be 10 digits.";
  }
  return "";
};

// Name validation (only first letter capitalized, no numbers/symbols)
export const validateNames = (name: string) => {
  const namePattern = /^[A-Z][a-z]+$/;
  if (!name) {
    return "Name is required.";
  }
  if (!namePattern.test(name)) {
    return "Name must start with a capital letter and only contain letters.";
  }
  return "";
};

// Education validation (only characters, commas, and periods)
export const validateEducation = (education: string) => {
  const educationPattern = /^[a-zA-Z,.\s]+$/;
  if (!education) {
    return "Education is required.";
  }
  if (!educationPattern.test(education)) {
    return "Education must only contain letters, commas, and periods.";
  }
  return "";
};

// Current Position validation (only characters)
export const validateCurrentPosition = (currentPosition: string) => {
  const positionPattern = /^[a-zA-Z\s]+$/;
  if (!currentPosition) {
    return "Current Position is required.";
  }
  if (!positionPattern.test(currentPosition)) {
    return "Current position must only contain letters.";
  }
  return "";
};

// LinkedIn URL validation (optional, must start with https://www.linkedin.com/in/)
export const validateLinkedinUrl = (linkedinUrl: string) => {
  if (linkedinUrl && !/^https:\/\/www\.linkedin\.com\/in\//.test(linkedinUrl)) {
    return "LinkedIn URL must start with https://www.linkedin.com/in/";
  }
  return "";
};

// GitHub URL validation (optional, must start with https://github.com/)
export const validateGithubUrl = (githubUrl: string) => {
  if (githubUrl && !/^https:\/\/github\.com\//.test(githubUrl)) {
    return "GitHub URL must start with https://github.com/";
  }
  return "";
};

// Bio validation (20-100 words)
export const validateBio = (bio: string) => {
  const wordCount = bio.split(/\s+/).length;
  if (!bio) {
    return "Bio is required.";
  }
  if (wordCount < 20) {
    return "Bio must be at least 20 words.";
  }
  if (wordCount > 100) {
    return "Bio cannot exceed 100 words.";
  }
  return "";
};


export const validateImageFile = (file: File): string | undefined => {
  // const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg']; // List of valid image MIME types
  const maxFileSize = 5 * 1024 * 1024; // Example: maximum file size of 5MB

  if (!file) {
    return "No file selected.";
  }

  // // Check if the file is an image
  // if (!validImageTypes.includes(file.type)) {
  //   return "Only PNG, JPG, and JPEG images are allowed.";
  // }

  // Check if the file exceeds the maximum size (optional)
  if (file.size > maxFileSize) {
    return "File size must be less than 5MB.";
  }

  return undefined; // Return undefined if all validations pass
};
