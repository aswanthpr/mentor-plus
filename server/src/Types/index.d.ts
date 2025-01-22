
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


