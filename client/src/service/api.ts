/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
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
): Promise<AxiosResponse | any> => {
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
export const fetchSubmitRating = async (
  review: string,
  selectedSession: ISession,
  rating?: number
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.post(`/mentee/review-and-rating`, {
      rating,
      review,
      sessionId: selectedSession?._id,
      menteeId: selectedSession?.menteeId,
      mentorId: selectedSession?.slotDetails?.mentorId,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchHomeData = async (
  filter: string,
  search: string,
  page: number,
  limit: number
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.get(`/mentee/home/${filter}`, {
      params: {
        search,
        page,
        limit,
      },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchNotification = async (): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.get(`/mentee/notification`);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchLogout = async (): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.post(`/mentee/logout`);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const ReadNotification = async (
  id: string
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.patch(`/mentee/notification-read/${id}`);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchBookingSlots = async (
  activeTab: string
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.get(`/mentee/sessions`, {
      params: { activeTab },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

//MENTOR-ONLY//============================================================

export const fetchMentorHomeData = async (
  filter: string,
  search: string,
  page: number,
  limit: number
): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.get(`/mentor/home/${filter}`, {
      params: {
        search,
        page,
        limit,
      },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
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

export const fetchHandleWithdraw = async (amount: number) => {
  try {
    return await axiosInstance.put(`/mentor/withdraw-amount`, {
      amount,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const createNewSlots = async (scheduleData: {
  type: string;
  schedule: TimeSlot[];
}): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.post(
      `/mentor/schedule/create-slots`,
      scheduleData
    );
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchTimeSlots = async (): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.get(`/mentor/schedule/get-time-slots`);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const deleteTimeSlots = async (
  slotId: string
): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.delete(`/mentor/schedule/remove-time-slot`, {
      data: { slotId },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchMentorStatistics = async (
  timeRange: string
): Promise<AxiosResponse | any> => {
  try {
    console.log('hai.........',timeRange)
    return await axiosInstance.get(`/mentor/statistics`,{params:{timeRange}});
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
//ADMIN ============================================================

export const fetchDashboardData = async (
  signal: AbortSignal,
  timeRange: string
) => {
  try {
    return await API.get(`/admin/dashboard`, {
      signal,
      params: {
        timeRange,
      },
    });
  } catch (error: unknown) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    }
    console.log(error instanceof Error ? error.message : String(error));
  }
};
