import mongoose, { Schema,Document } from "mongoose";

export interface Icategory extends Document{
    category:string;
    isBlocked?:boolean
}

const categorySchema:Schema<Icategory> = new mongoose.Schema({
    category:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        minlength:[3,"Name must be atleast 3 characters long"]
    },
    isBlocked:{
        type:Boolean,
        default:false,

    }
},{timestamps:true})

export default  mongoose.model<Icategory>('category',categorySchema);