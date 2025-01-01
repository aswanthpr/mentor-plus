import mongoose, { Document } from 'mongoose';
export interface IMentee extends Document {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    bio?: string | null;
    isBlocked: boolean;
    profileUrl?: string;
    linkedinUrl: string;
    githubUrl: string;
    education: string;
    currentPosition: string;
    verified?: boolean;
    isAdmin: boolean;
}
declare const _default: mongoose.Model<IMentee, {}, {}, {}, mongoose.Document<unknown, {}, IMentee> & IMentee & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=MenteeModel.d.ts.map