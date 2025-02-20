import { Schema,Document,model,Types } from "mongoose";
export  type TmessgeType = "text"|"image"|'video'|"file"
export interface Imessage extends Document{
    chatId:Types.ObjectId;
    senderId:Types.ObjectId;
    receiverId:Types.ObjectId;
    senderType:"mentee"|"mentor";
    content:string;
    seen:boolean;
    messageType:TmessgeType;
    mediaUrl:string;
    createdAt:Date;
    updatedAt:Date;
}

const messgeSchema:Schema<Imessage> = new Schema({
    chatId:{type:Schema.Types.ObjectId,ref:'chat',required:true,index:true},
    senderId:{type:Schema.Types.ObjectId,refPath:"senderType",required:true,index:true},
    receiverId:{type:Schema.Types.ObjectId,required:true,index:true},
    senderType:{type:String,enum: ['mentee','mentor']},
    content: { type: String, required: true },
    messageType:{type:String,enum:["text","image","video","file"],default:"text"},
    mediaUrl:{type:String,default:null},
    seen: { type: Boolean, default: false },
},
{
    timestamps:true
});


export default model<Imessage>('message',messgeSchema);
