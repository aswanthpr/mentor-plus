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
  _id:string;
  menteeId: string;
  status: string;
  slotId: string;
  isAttended: boolean;
  isExpired: boolean;
  paymentStatus: string;
  paymentMethod: string;
  paymentAmount: string;
  paymentTime:string;
  duration: string;
  meetingLink: string|null;
  description:string;
  slotDetails:Itime;
  user:IMentor|IMentee
  }



  interface Ichat{
    _id:string;
    menteeId: string;
    mentorId:string;
    lastMessage: string;
    createdAt: string;
    updatedAt: string;
    users:IMentee|IMentor|null
    online?:boolean;
  };

   interface Imessage {
    _id?:string
    chatId:string;
    senderId:string;
    receiverId:string;
    senderType:"mentee"|"mentor";
    content:string;
    seen?:boolean;
    messageType?:string;
    mediaUrl?:string;
    createdAt?:string;
    updatedAt?:string;
}