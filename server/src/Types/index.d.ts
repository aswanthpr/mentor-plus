// import 'express-session';


//  declare module 'express-session'{ 
//   interface Session { 
//     userId?: string; 
//   }
// }
// interface CustomRequest extends Request {

//   user: {

//       userId: string;

//   };

// }
declare module "bson" {
  interface ObjectId {
    questionId: this;
  }
}
  interface IMentorApplication {
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
  interface IMentorFiles {
   profileImage: Express.Multer.File | null;
   resume: Express.Multer.File | null;
 }
  export interface IMentorApplyData {
   body: IMentorApplication;
   files: IMentorFiles;
 }
 

 //qa interfaces
 export  interface IcreateQuestion {
  title: string;
  content: string;
  tags: string[];
  menteeId?:string
}


