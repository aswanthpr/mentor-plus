/* eslint-disable @typescript-eslint/no-explicit-any */
import  axios, { AxiosResponse } from "axios";
import { axiosInstance } from "../Config/mentorAxios";
import { protectedAPI } from "../Config/Axios";
import { API } from "../Config/adminAxios";


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
export const fetchWalletData = async (role: string) => {
  try {
    const apiClient = role === "mentee" ? protectedAPI : axiosInstance;
    return await apiClient.get(`/${role}/wallet`, { params: { role } });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

//MENTEE-ONLY//============================================================
export const fetchSlotBookingPageData = async (mentorId: string) => {
  try {
    return await protectedAPI.get(`/mentee/slot-booking`, {
      params: mentorId,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchAddMoney = async (amount: number) => {
  try {
    return await protectedAPI.post(`/mentee/wallet/add-money-wallet`, {
      amount,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const confirmSlotBooking = async (
  selectedSlot: Itime,
  message: string,
  selectedPayment: string,
  totalPrice: number,
  mentorName: string
) => {
  try {
    return await protectedAPI.post(`/mentee/slot-booking`, {
      timeSlot: selectedSlot,
      message,
      paymentMethod: selectedPayment,
      totalAmount: totalPrice,
      mentorName,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchCanceSession = async (
  sessionId: string,
  customReason: string,
  reason: string
) => {
  try {
    return await protectedAPI.patch(
      `/mentee/sessions/cancel_request/${sessionId}`,
      {
        customReason,
        reason,
      }
    );
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchSubmitRating = async (review:string,selectedSession:ISession,rating?:number)=>{
  try {
   

    return await protectedAPI.post(`/mentee/review-and-rating`,{
      rating,
      review,
      sessionId:selectedSession?._id,
      menteeId:selectedSession?.menteeId,
      mentorId:selectedSession?.slotDetails?.mentorId,
    }) ;
  } catch (error:unknown) {
    console.log(error instanceof Error ? error.message : String(error))
  }
}

//MENTOR-ONLY//============================================================

export const fetchCanceSessionResponse = async (
  sessionId: string,
  value: string
): Promise<AxiosResponse<any> | undefined> => {
  try {
    return await axiosInstance.patch(
      `/mentor/sessions/cancel_request/${sessionId}`,
      {
        value,
      }
    );
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const createSessionCodeApi = async (
  bookingId: string
): Promise<AxiosResponse<any> | undefined> => {
  try {
    return await axiosInstance.patch("/mentor/sessions/create-session-code", {
      bookingId,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const markAsSessionCompleted = async (bookingId: string) => {
  try {
    return await axiosInstance.patch(
      "/mentor/sessions/mark-as-session-completed",
      { bookingId }
    );
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchHandleWithdraw = async (amount:number)=>{
  try {
   
    return await axiosInstance.put(`/mentor/withdraw-amount`,{
     amount,
    }) ;
  } catch (error:unknown) {
    console.log(error instanceof Error ? error.message : String(error))
  }
}

//ADMIN ============================================================

export const fetchDashboardData = async (signal:AbortSignal)=>{
  try {
   
    return await API.get(`/admin/dashboard`,{signal}) ;
  } catch (error:unknown) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    }
    console.log(error instanceof Error ? error.message : String(error))
  }
}
