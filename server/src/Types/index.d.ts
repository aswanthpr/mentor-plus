import { Ianswer } from "../Model/answerModel";
import { Itime, slot } from "../Model/timeModel";

import { Imentee } from "../Model/menteeModel";
import { Imentor } from "../Model/mentorModel";

interface ImentorApplication {
  name: string;
  email: string;
  phone: string;
  password: string;
  bio: string;
  linkedinUrl: string;
  githubUrl: string;
  skills: string[];
  jobTitle: string;
  category: string;
}
interface ImentorFiles {
  profileImage: Express.Multer.File | null;
  resume: Express.Multer.File | null;
}
export interface ImentorApplyData {
  body: ImentorApplication;
  files: ImentorFiles;
}

//qa interfaces
export interface IcreateQuestion {
  title: string;
  content: string;
  tags: string[];
  menteeId?: string;
}

export interface ISlots {
  startDate: string;
  endDate?: string;
  slots: slot[];
  selectedDays?: string[];
  price: string;
}

export interface ISchedule {
  slots: slot[];
  price: string;
  startDate: string;
  mentorId?: ObjectId;
}
export interface Itimes extends Itime {
  startTime: string;
  endTime: string;
}

export interface CheckoutSessionData {
  payment_status: string;
  payment_intent: string;
  amount_total: number;
  customer: string;
}
export interface InewSlotSchedule {
  menteeId: ObjectId;
  slotId: ObjectId;
  paymentStatus: string;
  paymentTime: string;
  paymentMethod: string;
  paymentAmount: string;
  duration: string;
  description: string;
  status: string;
  times?: Itime;
}

//extended types
export interface IanswerWithQuestion extends Ianswer {
  question: {
    _id: ObjectId;
    menteeId: ObjectId;
  };
  user:Imentee
}

interface IchatWithUser {
  _id: string;
  menteeId: string;
  mentorId: string;
  lastMessage: string;
  createdAt: string;
  users?: Imentee | Imentor;
}
interface IMessage {
  chatId: string;
  senderId: string;
  receiverId: string;
  senderType: "mentee" | "mentor";
  content: string;
  seen: boolean;
  messageType: string;
  mediaUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface IcheckedSlot {
  _id: ObjectId;
  slots: slot;
}

interface IcardData {
  totalRevenue: number;
  totalBookings: number;
  totalCancelledBookings: number;
  uniqueMentorsThisMonth: number;
  yearly?: { year: number; revenue: number; session: number }[];
  monthly?: { month: number; revenue: number; session: number }[];
  weekly?: { week: number; revenue: number; session: number }[];
  categoryDistribution: { category: string; value: number }[];
  topMentors: {
    mentorId: string;
    mentorName: string;
    totalSessions: number;
    totalRevenue: number;
    category: string;
    averageRating: number;
    profileUrl: string;
  };
}

interface IcardResult {
  currentMonthRevenue: { totalRevenue: number }[];
  currentMonthTotalBookings: { totalBookings: number }[];
  currentMonthCancelledBookings: { totalCancelledBookings: number }[];
  currentDaySessionsToAttend: { totalSessionsToAttend: number }[];
}
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
  year: number;
}

interface TimeData {
  period: PeriodData[];
  cumulativeSession: CumulativeSessionData[];
}
interface ItopMentors{
  mentorId: string,
  mentorName:string,
  totalSessions:number,
  totalRevenue:number,
  category:string,
  averageRating:number,
  profileUrl:string
}
interface ImentorChartData{
  currentMonthRevenue:number;
  currentMonthTotalBookings: number;
  currentMonthCancelledBookings: number;
  currentDaySessionsToAttend:number;
  period: RevenueData[];
  cumulativeSession: CumulativeSessionData[],
  topMentors:ItopMentors[]|[]
}
interface ImailOption {
  to:string;
  subject:string;
  text?:string;
  html?:string;
}


 type TurnCredentialsResponse = {
  sessionCode?: string;
  iceServers?: RTCIceServer[];
  ttl?: number;
  expiresAt?: string;
  createdAt?: string;
};


interface IuserDetailsHeader{
  name:string;
  email:string;
  profileUrl:string;
}