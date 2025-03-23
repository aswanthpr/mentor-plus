import * as EmailValidator from "email-validator";
export const linkedinUrlPattern =
  /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
export const githubUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/?$/;
export const noNumbersOrSymbols = /^[a-zA-Z\s]+$/;

export const validateName = (name: string): string | undefined => {
  if (name.length < 4 || name.length > 25) {
    return "Name must be at least 3-25 characters long";
  }
  if (!/^[a-zA-Z\s]*$/.test(name)) {
    return "Name can only contain letters and spaces";
  }
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return "Email is required";
  }

  if (!EmailValidator.validate(email)) {
    return "Please enter a valid email address";
  }

  return undefined;
};

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

export const validateConfirmPassword = (
  confirmPassword: string,
  password: string
): string | undefined => {
  if (password === undefined || confirmPassword === undefined) {
    console.log("Password or confirmPassword is undefined");
    return "Passwords are required";
  }

  if (password !== confirmPassword) {
    console.log("Passwords do not match:", { password, confirmPassword });
    return "Passwords do not match";
  }

  return undefined;
};

export const categoryValidation = async (
  category: string
): Promise<boolean> => {
  if (!category) {
    return false;
  }
  const regex = /^[a-zA-Z0-9\s,&]{3,50}$/;
  return regex.test(category);
};

export const validatePhone = (phone: string) => {
  const phonePattern = /^[0-9]{10,}$/;
  if (phone && !phonePattern.test(phone)) {
    return "Phone number must be at least 10 digits and contain only numbers.";
  }
  return undefined;
};

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

export const validateLinkedinUrl = (linkedinUrl: string) => {
  if (linkedinUrl && !/^https:\/\/www\.linkedin\.com\/in\//.test(linkedinUrl)) {
    return "LinkedIn URL must start with https://www.linkedin.com/in/";
  }
  return "";
};

export const validateGithubUrl = (githubUrl: string) => {
  if (githubUrl && !/^https:\/\/github\.com\//.test(githubUrl)) {
    return "GitHub URL must start with https://github.com/";
  }
  return "";
};

export const validateBio = (bio: string) => {
  const wordCount = bio.split(/\s+/).length;
  if (!bio) {
    return "Bio is required.";
  }
  if (wordCount < 20) {
    return "Bio must be at least 20 words.";
  }
  if (wordCount > 200) {
    return "Bio cannot exceed 100 words.";
  }
  return "";
};

export const validateImageFile = (
  file: File | undefined
): string | undefined => {
  if (!file) {
    return "";
  }

  const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
  const maxFileSize = 5 * 1024 * 1024;

  if (!validImageTypes.includes(file.type)) {
    return "Only PNG, JPG, and JPEG images are allowed.";
  }

  if (file.size > maxFileSize) {
    return "File size must be less than 5MB.";
  }

  return "";
};

export const validateSkills = (skills: string[]) => {
  const noNumbersOrSymbols = /^[a-zA-Z\s]+$/;
  if (
    skills.length === 0 ||
    skills.some(
      (skill: string) => skill.length < 3 || !noNumbersOrSymbols.test(skill)
    )
  ) {
    return "It must be at least 3 characters long and contain no numbers or symbols.";
  }
  return "";
};

export const ValidatingIsOverlapping = (
  slots: { startTime: string; endTime: string }[]
) => {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const startA = slots[i].startTime;
      const endA = slots[i].endTime;
      const startB = slots[j].startTime;
      const endB = slots[j].endTime;

      // Check if times overlap
      if (
        (startA < endB && endA > startB) || // Overlap case
        (startB < endA && endB > startA)
      ) {
        return true;
      }
    }
  }
  return false;
};
