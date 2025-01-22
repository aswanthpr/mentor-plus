import mongoose,{Document, Schema } from "mongoose";


export interface Iotp extends Document{
    email:string;
    otp:string;
}
const otpSchema:Schema<Iotp>  =new Schema<Iotp>({
    email:{type:String,required:true},
    otp:{type:String,required:true},
    
},{timestamps:true})
otpSchema.index({createdAt:1},{expireAfterSeconds:115})

export default mongoose.model<Iotp>('Otp',otpSchema);