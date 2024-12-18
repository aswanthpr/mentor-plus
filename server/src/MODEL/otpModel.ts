import mongoose,{Document, Schema } from "mongoose";


export interface IOtp extends Document{
    email:string;
    otp:string;
}
const otpSchema:Schema<IOtp>  =new Schema<IOtp>({
    email:{type:String,required:true},
    otp:{type:String,required:true},
    
},{timestamps:true})
otpSchema.index({createdAt:1},{expireAfterSeconds:115})

export default mongoose.model<IOtp>('Otp',otpSchema);