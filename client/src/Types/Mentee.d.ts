

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
  provider: string;
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
interface Inotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  userType:"mentor" | "mentee" | "admin",
  url?: string;
  createdAt: string;
}
