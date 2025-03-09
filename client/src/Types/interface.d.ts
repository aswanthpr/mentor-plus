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

interface SkillData {
  category: string;
  skills: string[];
}

interface ICategory {
  id: string;
  category: string;
  isBlocked: boolean;
}
//slot Schedule
interface ISession {
  _id: string;
  menteeId: string;
  status: string;
  slotId: string;
  isExpired: boolean;
  paymentStatus: string;
  paymentMethod: string;
  paymentAmount: string;
  paymentTime: string;
  duration: string;
  sessionCode: string | null;
  description: string;
  slotDetails: Itime;
  user: IMentor | IMentee;
}

interface Ichat {
  _id: string;
  menteeId: string;
  mentorId: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  users: {
    _id: string;
    name: string;
    online?: boolean;
    email: string;
    phone: string;
    profileUrl: string;
    linkedinUrl: string;
    githubUrl: string;
  };
}

interface Imessage {
  _id?: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  senderType: string;
  content: string;
  seen?: boolean;
  messageType?: string;
  mediaUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Ifilter {
  sort: string;
  domain: string[];
  skill: string[];
}

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
  userType: "mentor" | "mentee" | "admin";
  url?: string;
  createdAt: string;
}
interface IMentor {
  _id?: string;
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
  resume?: File | null;
  profileImage?: Blob | null;
}
interface IFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  jobTitle: string;
  category: string;
  linkedinUrl: string;
  githubUrl: string;
  bio: string;
  skills?: string[];
  profileImage: Blob | null;
  resume: File | null;
}
interface IMentorErrors {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  jobTitle: string;
  category: string;
  skills: string | undefined;
  resume: string;
}

//metnor applay
interface IErrors {
  name: string;
  email: string;
  password: string;
  phone: string;
  jobTitle: string;
  category: string;
  linkedinUrl: string;
  githubUrl: string;
  bio: string;
  skills: string;
  resume: string;
  profileImage: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  slots: TimeSlot[];
  price: string;
  startDate: string;
}

interface ISchedule {
  startDate: string;
  endDate?: string;
  slots: TimeSlot[];
  selectedDays?: string[];
  price: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (scheduleData) => void;
}
interface IslotField {
  startTime: string;
  endTime: string;
}
interface Itime {
  _id?: string;
  startDate: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  price: string;
  mentorId: string;
  slots?: IslotField[];
  duration?: number;
}

interface RecurringSchedule {
  startDate: string;
  endDate: string;
  slots: TimeSlot[];
  selectedDays: string[];
  price: string;
}

interface Ianswer {
  _id?: string;
  answer: string;
  authorId: string;
  authorType: string;
  questionId: string;
  author?: IMentee | IMentor;
  createdAt: string;
  updatedAt: string;
  isBlocked?: boolean;
}

interface IQuestion {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  menteeId: string;
  createdAt: string;
  updatedAt: string;
  answers?: string;
  user?: IMentee;
  answerData?: Ianswer[];
  isBlocked: boolean;
}
interface Answer {
  id: string;
  content: string;
  isBlocked: boolean;
  createdAt: string;
  author: string;
}

interface Question {
  id: string;
  content: string;
  answers: Answer[];
  isBlocked: boolean;
  createdAt: string;
  author: string;
}
interface Itransaction{
  _id:string
  transactionType: string;
  amount: number;
  note: string;
  walletId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
interface Iwallet {
  _id:string
  userId:string;
  balance:string;
  transaction:Itransaction[];
}