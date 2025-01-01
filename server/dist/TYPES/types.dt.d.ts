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
interface IMentorApplyData {
    body: IMentorApplication;
    files: IMentorFiles;
}
