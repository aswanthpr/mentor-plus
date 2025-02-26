import mongoose, { Document } from "mongoose";
export type TmessageType = "text" | "image" | "document";
export interface Imessage extends Document {
    chatId: mongoose.Schema.Types.ObjectId;
    senderId: mongoose.Schema.Types.ObjectId;
    receiverId: mongoose.Schema.Types.ObjectId;
    senderType: "mentee" | "mentor";
    content: string;
    seen: boolean;
    messageType: TmessageType;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<Imessage, {}, {}, {}, mongoose.Document<unknown, {}, Imessage> & Imessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=messageSchema.d.ts.map