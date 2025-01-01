import mongoose, { Document } from "mongoose";
export interface IMentor extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    bio: string;
    profileUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    resume: string;
    skills: string[];
    isBlocked: boolean;
    verified: boolean;
    jobTitle: string;
    category: string;
}
declare const _default: mongoose.Model<IMentor, {}, {}, {}, mongoose.Document<unknown, {}, IMentor> & IMentor & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=mentorModel.d.ts.map