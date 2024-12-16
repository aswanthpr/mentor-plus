import mongoose from 'mongoose';


export const connectDb = async():Promise<void>=>{
    try {
        await mongoose.connect(process.env.MONGO_URL as string)
        console.log('\x1b[35m%s\x1b[0m','database is connected successfully')
    } catch (error:any) {
        console.log('\x1b[34m%s\x1b[0m','failed to connect with database',error)
    }
}  