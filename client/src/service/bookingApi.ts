/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { axiosInstance } from "../Config/mentorAxios";
import { protectedAPI } from "../Config/Axios";

export const createSessionCodeApi = async  (bookingId:string): Promise<AxiosResponse<any> | undefined>=>{
    try {
    return await axiosInstance.patch('/mentor/sessions/create-session-code',{bookingId});
    } catch (error:unknown) {
        console.log(error instanceof Error? error.message:String(error));

    }
}
export const  markAsSessionCompleted = async (bookingId:string)=>{
    try {
        return await axiosInstance.patch('/mentor/sessions/mark-as-session-completed',{bookingId});
    } catch (error:unknown) {
        console.log(error instanceof Error? error.message:String(error));
    }
}

export const joinSessionHandler = async (sessionId:string,sessionCode:string,role:string):Promise<{
  session_Code: any;status:number,data:{success:boolean,message:string,session_Code: string}
}|undefined> =>{
    try {
        return await (role=="mentor"?axiosInstance:protectedAPI).post(`/${role}/session/validate-session-join`,{ sessionId, sessionCode });
    } catch (error:unknown) {
        console.log(error instanceof Error? error.message:String(error));
    }
}