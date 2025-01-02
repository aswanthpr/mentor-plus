interface IMentee {
  _id: string;
  bio: string;
  name: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  verified: boolean;
  isBlocked: boolean;
  profileUrl: string;
  currentPosition: string;
  education: string;
}

interface IMentor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  profileUrl: string;
  isBlocked: boolean;
  verified?: boolean;
  linkedinUrl: string;
  githubUrl: string;
  jobTitle: string;
  category: string;
  skills: string[];
  resume: string;
}

interface IFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  currentPosition?: string;
  education?: string;
}

interface IPass {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
interface ICategory {
  _id: string;
  category: string;
  isBlocked: boolean;
}


