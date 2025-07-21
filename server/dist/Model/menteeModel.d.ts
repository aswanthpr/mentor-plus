import mongoose, { Document, Types } from "mongoose";
export interface Imentee extends Document {
    _id: Types.ObjectId;
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
    provider: string;
}
declare const _default: mongoose.Model<Imentee, {}, {}, {}, mongoose.Document<unknown, {}, Imentee> & Imentee & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=menteeModel.d.ts.map