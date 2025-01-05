// import 'express-session';


//  declare module 'express-session'{ 
//   interface Session { 
//     user?: string; 
//   }
// }
export interface IMentorApplication {
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

export interface ICategoryWithSkill  implements IMentor{
  category:string;
  skills:string[]
} 