    import mongoose,{ Document, Schema, Types, } from "mongoose";

    export interface Imentor extends Document {
        _id:Types.ObjectId
        name: string;
        email: string;
        phone: string;
        password: string;
        bio: string;
        profileUrl: string;
        linkedinUrl: string;
        githubUrl: string;
        resume: string;
        skills: string[];
        isBlocked: boolean;
        verified: boolean;
        jobTitle: string;
        category:string;

    }

    const mentorSchema:Schema<Imentor> = new mongoose.Schema({
        name:{
            type:String,
            required:true,
            minlength:3,
            trim: true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim: true,
        },
        phone:{
            type:String,
            required:true,
            trim: true,
        },
        password:{
            type:String,
            required:true,
            trim: true,
        },
        bio:{
            type:String,
            required:true,
            trim: true,
        },
        jobTitle:{
            type:String,
            required:true,
            trim: true,
        },
        category:{
            type:String,
            required:true,
            trim: true
        },
        skills:{
            type:[String],
            default:[]
        },
        linkedinUrl:{
            type:String,
            default:null,
            trim:true
        },
        githubUrl:{
            type:String,
            default:null,
            trim:true
        },
        profileUrl:{
            type:String,
            default:null,
            trim:true
        },
        resume:{
            type:String,
            required:true
        },
        isBlocked:{
            type:Boolean,
            default:false,
        },
        verified:{
            type:Boolean,
            default:false
        },
    },
        {timestamps:true}
    );

    export default mongoose.model<Imentor>('mentor',mentorSchema)