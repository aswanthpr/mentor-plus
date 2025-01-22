import mongoose, { Document } from "mongoose";
export interface Iotp extends Document {
    email: string;
    otp: string;
}
declare const _default: mongoose.Model<Iotp, {}, {}, {}, mongoose.Document<unknown, {}, Iotp> & Iotp & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=otpModel.d.ts.map