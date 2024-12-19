import mongoose, {Schema , Document} from 'mongoose';

export interface IMentee extends Document {
    name:string;
    email:string;
    phone?:string;
    password:string;
    bio?:string|null;
    isBlocked?:boolean;
    skills?:string[];
    profileUrl?:string;
    verified?:boolean;
    isAdmin?:boolean;
}

const menteeSchema:Schema<IMentee> = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
        minlength:[3,"Name must be atleast 3 characters long"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        trim:true,
    },
    phone:{
        type:String,
        default:null,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        trim:true
    },
    bio:{
        type:String,
        default:null,
        trim:true,
    },
    skills:{
        type:[String],
        default:[]
    },
    profileUrl:{
        type:String,
        default:null,
        trim:true
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    isAdmin:{
        type:Boolean,
        defualt:false
    },
    verified:{
        type:Boolean,
        default:false
    }

},{timestamps:true});


export default mongoose.model<IMentee>('Mentee',menteeSchema)