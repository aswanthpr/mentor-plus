/* eslint-disable @typescript-eslint/no-explicit-any */

//MENTOR-ONLY//============================================================

import { AxiosResponse } from "axios";
import { axiosInstance } from "../Config/mentorAxios";
import { unProtectedAPI } from "../Config/Axios";
import { errorHandler } from "../Utils/Reusable/Reusable";

export const fetchMentorHomeData = async (
  filter: string,
  search: string,
  sortField: string,
  sortOrder: string,
  page: number,
  limit: number
): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.get(`/mentor/home/${filter}`, {
      params: {
        search,
        sortField,
        sortOrder,
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
    errorHandler(error);
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
    errorHandler(error);
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
    errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchHandleWithdraw = async (amount: number) => {
  try {
    return await axiosInstance.put(`/mentor/withdraw-amount`, {
      amount,
    });
  } catch (error: unknown) {
    errorHandler(error);

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
    errorHandler(error);

  }
};
export const fetchTimeSlots = async (
  search: string,
  filter: string,
  sortField: string,
  sortOrder: string,
  page: number,
  limit: number
): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.get(`/mentor/schedule/get-time-slots`, {
      params: {
        search,
        filter,
        sortField,
        sortOrder,
        page,
        limit,
      },
    });
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
    errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchMentorStatistics = async (
  timeRange: string
): Promise<AxiosResponse | any> => {
  try {
    console.log("hai.........", timeRange);
    return await axiosInstance.get(`/mentor/statistics`, {
      params: { timeRange },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const getMentorSessions = async (
  activeTab: string,
  search: string,
  sortField: string,
  sortOrder: string,
  filter: string,
  page: number,
  limit: number
): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.get(`/mentor/sessions`, {
      params: {
        activeTab,
        search,
        sortField,
        sortOrder,
        filter,
        page,
        limit,
      },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchEditProfile = async (
  Data: Partial<IMentor>
): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.put(
      `/mentor/profile/edit_profile_details`,
      Data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  } catch (error: unknown) {
    errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchChangePassword = async (
  passFormData: IChangePass
): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.patch(
      "/mentor/profile/change_password",
      passFormData
    );
  } catch (error: unknown) {
    errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchChangeImage = async (
  profileImage: Blob,
  _id: string
): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.patch(
      "/mentor/profile/image_change",
      { profileImage, _id },
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } catch (error: unknown) {
    errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchMentorNotification = async (): Promise<
  AxiosResponse | any
> => {
  try {
    return await axiosInstance.get(`/mentor/notification`);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchReadNotification = async (
  id: string
): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.patch(`/mentor/notification-read/${id}`);
  } catch (error: unknown) {

    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchMentorLogout = async (): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.post(`/mentor/logout`);
  } catch (error: unknown) {
    errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchMentorApplication = async (): Promise<
  AxiosResponse | any
> => {
  try {
    return await unProtectedAPI.get(`/auth/apply_as_mentor`);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchMentorLogin = async (
  formData: LoginFormData
): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.post("/auth/login/mentor", formData);
  } catch (error: unknown) {
     errorHandler(error);
     
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchCreateNewAnsweres = async (
  answer: string,
  questionId: string,
  userType: string
): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.post(`/mentor/qa/create-new-answer`, {
      answer,
      questionId,
      userType,
    });
  } catch (error: unknown) {
    errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchMentorEditAnswer = async (
  content: string,
  answerId: string
): Promise<AxiosResponse | any> => {
  try {
    return await axiosInstance.patch(`/mentor/qa/edit-answer`, {
      content,
      answerId,
    });
  } catch (error: unknown) {
    errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const newMentorApply = async (
  formData:any
): Promise<AxiosResponse | any> => {
  try {
    return await   unProtectedAPI.post(`/auth/apply_as_mentor`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });
  } catch (error: unknown) {
    errorHandler(error);
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchMentorProfileData = async (
): Promise<AxiosResponse | any> => {
  try {
    return await  axiosInstance.get("/mentor/profile");
  } catch (error: unknown) {
   
    console.log(error instanceof Error ? error.message : String(error));
  }
};
