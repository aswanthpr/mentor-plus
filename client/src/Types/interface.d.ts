interface Iprotector {
  element: React.ReactNode;
}
interface Inotify {
  [key: string]: Inotification[];
}
interface IAccessToken {
  accessToken: string;
  role: string;
}
interface ImentorToken {
  mentorToken: string;
  mentorRole: string;
}
interface IadminToken {
  adminToken: string;
  adminRole: string;
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
  slotDetails?: Itime;
  user?: IMentor | IMentee;
  review?: Ireview | null;
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
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  isBlocked?: boolean;
  verified?: boolean;
  profileUrl?: string;
  skills?:string[]
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
  reviews?: Ireview[];
  averageRating?: number;
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
interface IProfileData {
  name: string;
  phone: string;
  email: string;
  expertise: string;
  bio: string;
  avatar?: string;
  skills: string[];
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
  price: string ;
  startDate: string;
}

interface ISchedule {
  startDate: string;
  endDate?: string;
  slots: TimeSlot[];
  selectedDays?: string[];
  price: number | null;
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
interface Itransaction {
  _id: string;
  transactionType: string;
  amount: number;
  note: string;
  walletId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
interface Iwallet {
  _id: string;
  userId: string;
  balance: string;
  transaction: Itransaction[];
}
interface Ireview {
  _id: string;
  menteeId: string;
  menteeId: string;
  sessionId: string;
  rating: number;
  feedback: string;
  role: string;
  mentee: IMentee;
  createdAt?: string;
  updatedAt?: string;
}
interface ItopMentors {
  mentorId: string;
  mentorName: string;
  totalSessions: number;
  totalRevenue: number;
  category: string;
  averageRating: number;
  profileUrl: string;
}
interface IcardData {
  totalRevenue: number;
  totalBookings: number;
  totalCancelledBookings: number;
  uniqueMentorsThisMonth: number;
  yearly?: { year: number; revenue: number; sessions: number }[];
  monthly?: { month: number; revenue: number; sessions: number }[];
  weekly?: { week: number; revenue: number; sessions: number }[];
  categoryDistribution: { category: string; value: number }[];
  topMentors: ItopMentors[];
}

interface IChangePass {
  currentPassword: string;
  newPassword: string;
  _id: string;
}
type IUserType = "mentee" | "mentor";

interface LoginFormData {
  email: string;
  password: string;
}
interface LoginFormError {
  email?: string;
  password?: string;
}
//mentorChart Data;
interface RevenueData {
  month?: string;
  revenue: number;
  sessions: number;
  year?: string;
  week?: string;
}
interface CumulativeSessionData {
  revenue: number;
  cumulativeRevenue: number;
  month: number;
  year?: number;
}

interface ImentorChartData {
  currentMonthRevenue: number;
  currentMonthTotalBookings: number;
  currentMonthCancelledBookings: number;
  currentDaySessionsToAttend: number;
  period: RevenueData[];
  cumulativeSession: CumulativeSessionData[];
  topMentors: ItopMentors[];
}

interface IeditQuestion {
  title: string;
  content: string;
  tags: string[];
}
interface ISignupErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
interface IBookingError {
  message: string;
  wallet: string;
  stripe: string;
}
interface TimeSlot {
  startTime: string;
  endTime: string;
}
interface ISignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface INavItem {
  name: string;
  path: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
interface ErrorResponseData {
  user?: boolean;
  message?: string;
  success: boolean;
}
interface Category {
  _id: string;
  category: string;
  isBlocked?: boolean;
}

interface IMentee {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  isBlocked?: boolean;
  verified?: boolean;
  profileUrl?: string;
}

interface IError {
  email: string | undefined;
  password: string | undefined;
}
interface Transaction {
  id: string;
  type: Ttransaction;
  date: string;
  customer: string;
  amount: number;
  notes: string;
}
interface MentorFilters {
  categories: Category[];
  skills: string[];
  rating: number;
}



 interface IceServer {
  urls: string[]; 
  username?: string;
  credential?: string;
}

 interface TurnCredentials {
  iceServers: IceServer[];
  expiresAt: string; 
}