import { Schema, Types, Document } from "mongoose";
export interface IchatRoom extends Document {
    menteeId: Types.ObjectId;
    mentorId: Types.ObjectId;
    lastMessage: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const chatRoomSchema: Schema<IchatRoom>;
declare const _default: import("mongoose").Model<IchatRoom, {}, {}, {}, Document<unknown, {}, IchatRoom> & IchatRoom & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=chatRoom.d.ts.map