/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "../Config/mentorAxios";
import { protectedAPI, unProtectedAPI } from "../Config/Axios";
import { AxiosResponse } from "axios";


//COMMON_FETCH====================================================================
export const joinSessionHandler = async (
  sessionId: string,
  sessionCode: string,
  role: string
): Promise<
  | {
      session_Code: any;
      status: number;
      data: { success: boolean; message: string; session_Code: string };
    }
  | undefined
> => {
  try {
    const apiClient = role === "mentee" ? protectedAPI : axiosInstance;
    return await apiClient.post(`/${role}/session/validate-session-join`, {
      sessionId,
      sessionCode,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchWalletData = async (role: string,search:string,filter:string,page:number,limit:number) => {
  try {
    const apiClient = role === "mentee" ? protectedAPI : axiosInstance;
    return await apiClient.get(`/${role}/wallet`, { params: { role,search,filter,page,limit } });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchChats = async (role: string) => {
  try {
    const apiClient = role === "mentee" ? protectedAPI : axiosInstance;
    return await apiClient.get(`/${role}/chats`, { params: { role } });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchForgotPassword = async (user: string,email:string,password:string) => {
  try {
   
    return await unProtectedAPI.put(`/auth/change_password/${user == 'mentee' ? 'mentee' : 'mentor'}`, { email, password });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchForgotPassOtpVerify = async (email: string,otp:string) => {
  try {
   
    return await unProtectedAPI.post(`/auth/verify-otp`, { email, otp, type:'forgot_Passsword' });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const forgetPasswordResendOtp = async (email: string):Promise<AxiosResponse|any> => {
  try {
    return await unProtectedAPI.post('/auth/resend-otp', { email })
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchForgotPassSendOtp = async (email: string,user:string):Promise<AxiosResponse|any> => {
  try {
    return await  unProtectedAPI.post(`/auth/forgot_password/${user == 'mentee' ? 'mentee' : 'mentor'}`, { email });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

