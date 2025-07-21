/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { errorHandler } from "../Utils/Reusable/Reusable";
import { api } from "../Config/axiosInstance";

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
   
    return await api.get(`/${role}/session/validate-session-join`, {
      params:{
        sessionId,
        sessionCode,
      }
    });
  } catch (error: unknown) {
    errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchWalletData = async (
  role: string,
  search: string,
  filter: string,
  page: number,
  limit: number
) => {
  try {
   
    return await api.get(`/${role}/wallet`, {
      params: { role, search, filter, page, limit },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchChats = async (role: string) => {
  try {
    return await api.get(`/${role}/chats`, { params: { role } });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchForgotPassword = async (
  user: string,
  email: string,
  password: string
) => {
  try {
    return await api.put(
      `/auth/change_password/${user == "mentee" ? "mentee" : "mentor"}`,
      { email, password }
    );
  } catch (error: unknown) {
     errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchForgotPassOtpVerify = async (email: string, otp: string) => {
  try {
    return await api.post(`/auth/verify-otp`, {
      email,
      otp,
      type: "forgot_Passsword",
    });
  } catch (error: unknown) {
     errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const forgetPasswordResendOtp = async (
  email: string
): Promise<AxiosResponse | any> => {
  try {
    return await api.post("/auth/resend-otp", { email });
  } catch (error: unknown) {
    errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchForgotPassSendOtp = async (
  email: string,
  user: string
): Promise<AxiosResponse | any> => {
  try {
    return await api.post(
      `/auth/forgot_password/${user == "mentee" ? "mentee" : "mentor"}`,
      { email }
    );
  } catch (error: unknown) {
    errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};
