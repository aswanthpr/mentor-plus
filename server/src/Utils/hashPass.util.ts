import bcrypt from 'bcrypt';


export const hash_pass= async(password:string):Promise<string> =>{
try {
    const salt:string = await bcrypt.genSalt(10);
    const hashPassword:string = await bcrypt.hash(password,salt)

    return hashPassword as string
} catch (error:unknown) {
    throw new Error(`error while password hash ${error instanceof Error ?error.message:String(error)}`)
}
}
