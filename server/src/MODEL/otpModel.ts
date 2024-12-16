import mongoose,{Document, Schema } from "mongoose";


export interface IOtp extends Document{
    email:string;
    otp:number;
}
const otpSchema:Schema<IOtp>  =new Schema<IOtp>({
    email:{type:String,required:true},
    otp:{type:Number,required:true},
    
},{timestamps:true})
otpSchema.index({createdAt:1},{expireAfterSeconds:60})

export default mongoose.model<IOtp>('Otp',otpSchema);