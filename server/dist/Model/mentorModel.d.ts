import mongoose, { Document, Types } from "mongoose";
export interface Imentor extends Document {
    _id: Types.ObjectId;
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
declare const _default: mongoose.Model<Imentor, {}, {}, {}, mongoose.Document<unknown, {}, Imentor> & Imentor & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=mentorModel.d.ts.map