import mongoose, { Document } from "mongoose";
export interface IOtp extends Document {
    email: string;
    otp: string;
}
declare const _default: mongoose.Model<IOtp, {}, {}, {}, mongoose.Document<unknown, {}, IOtp> & IOtp & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=otpModel.d.ts.map