import { Document, Types } from "mongoose";
export type TmessgeType = "text" | "image" | 'video' | "file";
export interface Imessage extends Document {
    roomId: Types.ObjectId;
    senderId: Types.ObjectId;
    senderType: "mentee" | "mentor";
    content: string;
    seen: boolean;
    messageType: TmessgeType;
    mediaUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: import("mongoose").Model<Imessage, {}, {}, {}, Document<unknown, {}, Imessage> & Imessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=message.d.ts.map