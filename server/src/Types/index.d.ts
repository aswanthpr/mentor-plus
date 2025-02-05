import { Itime, slot } from "src/Model/timeModel";

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
 export  interface IcreateQuestion {
  title: string;
  content: string;
  tags: string[];
  menteeId?:string
}

export interface ISlots{
  startDate:string,
  endDate?:string;
  slots :slot[]
  selectedDays?:string[];
  price:string
}

export interface ISchedule {
  slots: slot[];    
  price: string;    
  startDate: string;
  mentorId?:ObjectId
}
export interface  Itimes extends Itime{
  startStr:string;
  endStr:string;
}

export  interface CheckoutSessionData {
  payment_status: string;
  payment_intent: string;
  amount_total: number;
  customer: string;
}
export interface InewSlotSchedule{
  menteeId: ObjectId;
  slotId: ObjectId;
  paymentStatus:string;
  paymentTime:string;
  paymentMethod:string;
  paymentAmount: string;
  duration:string;
  description:string
}