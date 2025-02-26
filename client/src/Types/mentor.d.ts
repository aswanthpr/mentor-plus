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
    resume?: File|null;
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
    skills: string|undefined;
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
    profileImage: string
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
  interface IslotField{
    startTime:string;
    endTime:string
  }
  interface Itime {
    _id?:string
    startDate:string; 
    startTime:string;
    endTime:string;
    isBooked:boolean;
    price:string
    mentorId:string;
    slots?:IslotField[];
    duration?:number
  }
   
  
  interface RecurringSchedule {
    startDate: string;
    endDate: string;
    slots: TimeSlot[];
    selectedDays: string[];
    price: string;
  }
  
