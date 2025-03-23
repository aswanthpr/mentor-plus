/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { protectedAPI, unProtectedAPI } from "../Config/Axios";

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
  sortField: string,
  sortOrder: string,
  page: number,
  limit: number
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.get(`/mentee/home/${filter}`, {
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
  activeTab: string,
  search: string,
  sortField: string,
  sortOrder: string,
  filter: string,
  page: number,
  limit: number
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.get(`/mentee/sessions`, {
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

export const fetchMenteeQuestions = async (
  search: string,
  filter: string,
  sortField: string,
  sortOrder: string,
  page: number,
  limit: number
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.get(`/mentee/qa`, {
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
export const fetchCreateQuestion = async (
  question: IeditQuestion
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.post(`/mentee/qa/add-question/`, question);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchEditQuestion = async (
  questionId: string,
  updatedQuestion: Partial<IQuestion>,
  filter: string
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.patch(`/mentee/qa/edit-question`, {
      questionId,
      updatedQuestion,
      filter,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchDeleteQuestion = async (
  questionId: string
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.delete(`/mentee/qa/delete/${questionId}`);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchCreateAnswer = async (
  answer: string,
  questionId: string,
  userType: string
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.post(`/mentee/qa/create-answer`, {
      answer,
      questionId,
      userType,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchEditAnswer = async (
  content: string,
  answerId: string
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.patch(`/mentee/qa/edit-answer`, {
      content,
      answerId,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchSimilarMentors = async (
  category: string,
  mentorId: string
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.get(`/mentee/explore/similar-mentors`, {
      params: {
        category,
        mentorId,
      },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchImageChange = async (
  profileImage: Blob,
  _id: string
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.patch(
      "/mentee/profile/change_profile",
      { profileImage, _id },
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchMenteeChangePassword = async (
  passFormData: IChangePass
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.patch(
      "/mentee/profile/change_password",
      passFormData
    );
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchProfileData = async (): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.get("/mentee/profile");
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export const fetchProfileEdit = async (
  menteeData: Partial<IMentee>
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.put("/mentee/profile/edit_profile", menteeData);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchMenteeEditAnswer = async (
  content: string,
  answerId: string
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.patch(`/mentee/qa/edit-answer`, {
      content,
      answerId,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchExplorePage = async (
  search: string,
  categories: Ifilter["domain"],
  skill: Ifilter["skill"],
  sort: Ifilter["sort"],
  page: number,
  limit: number
): Promise<AxiosResponse | any> => {
  try {
    return await protectedAPI.get(`/mentee/explore/`, {
      params: {
        search,
        categories,
        skill,
        sort,
        page,
        limit,
      },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchMenteeSignup = async (
  formData: Partial<IFormData>
): Promise<AxiosResponse | any> => {
  try {
    return await unProtectedAPI.post("/auth/signup", formData);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchVerifyOtp = async (
  email: string,
  otp: string
): Promise<AxiosResponse | any> => {
  try {
    return await unProtectedAPI.post("/auth/verify-otp", {
      email,
      otp,
      type: "signup",
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchResendOtp = async (
  email: string
): Promise<AxiosResponse | any> => {
  try {
    return await unProtectedAPI.post("/auth/resend-otp", { email });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchMenteeLogin = async (
  formData: LoginFormData
): Promise<AxiosResponse | any> => {
  try {
    const response = await unProtectedAPI.post(`/auth/login/mentee`, formData);
    return response;
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
