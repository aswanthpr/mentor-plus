import mongoose, { Schema,Document, Mongoose } from "mongoose";

export interface ICategory extends Document{
    category:string;
    isBlocked?:boolean
}

const categorySchema:Schema<ICategory> = new mongoose.Schema({
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

export default  mongoose.model<ICategory>('categ',categorySchema);