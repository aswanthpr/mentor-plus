/* eslint-disable @typescript-eslint/no-explicit-any */
//ADMIN ============================================================

import axios, { AxiosResponse } from "axios";
import { API, unAPI } from "../Config/adminAxios";
import { errorHandler } from "../Utils/Reusable/Reusable";
import { toast } from "react-toastify";

export const fetchDashboardData = async (
  signal: AbortSignal,
  timeRange: string
): Promise<AxiosResponse | any> => {
  try {
    return await API.get(`/admin/dashboard`, {
      signal,
      params: {
        timeRange,
      },
    });
  } catch (error: unknown) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error?.message);
    }
    console.log(error instanceof Error ? error?.message : String(error));
  }
};

export const fetchAdminLogin = async (
  email: string,
  password: string
): Promise<AxiosResponse | any> => {
  try {
    return await unAPI.post(`/auth/login/admin`, {
      email,
      password,
    });
  } catch (error: unknown) {
     errorHandler(error)
    console.log(error instanceof Error ? error?.message : String(error));
  }
};
export const fetchChangeAnswerStatus = async (
  answerId: string
): Promise<AxiosResponse | any> => {
  try {
    return await API.patch(`/admin/qa_management/change_answer_status`, {
      answerId,
    });
  } catch (error: unknown) {
    errorHandler(error);
    console.log(error instanceof Error ? error?.message : String(error));
  }
};
export const fetchQuestionMangement = async (
  search: string,
  Status: string,
  sortField: TSort,
  sortOrder: TSortOrder,
  page: number,
  limit: number
): Promise<AxiosResponse | any> => {
  try {
    return await API.get(`/admin/qa-management`, {
      params: {
        search,
        Status,
        sortField,
        sortOrder,
        page,
        limit,
      },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error?.message : String(error));
  }
};
export const changeQuestionStatus = async (
  questionId: string
): Promise<AxiosResponse | any> => {
  try {
    return await API.patch(`/admin/qa_management/change_question_status`, {
      questionId,
    });
  } catch (error: unknown) {
     errorHandler(error);
    console.log(error instanceof Error ? error?.message : String(error));
  }
};
export const fetchAdminLogout = async (): Promise<AxiosResponse | any> => {
  try {
    return await API.post(`/admin/logout`);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error?.message : String(error));
  }
};
export const fetchNotificaitionRead = async (
  id: string
): Promise<AxiosResponse | any> => {
  try {
    return await API.patch(`/admin/notification-read/${id}`);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error?.message : String(error));
  }
};
export const fetchAllNotification = async (): Promise<AxiosResponse | any> => {
  try {
    return await API.get(`/admin/notification`);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error?.message : String(error));
    
  }
};
export const fetchCategoryChange = async (
  id: string
): Promise<AxiosResponse | any> => {
  try {
    return await API.put(`/admin/change_category_status`, { id });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error?.message : String(error));
    errorHandler(error);
  }
};
export const fetchEditCategory = async (
  id: string,
  category: string
): Promise<AxiosResponse | any> => {
  try {
    return await API.patch(`/admin/edit_category`, {
      id,
      category,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error?.message : String(error));
     errorHandler(error);
  }
};
export const fetchAllcategoryData = async (
  searchQuery: string,
  statusFilter: string,
  sortField: string,
  sortOrder: string,
  page: number,
  limit: number
): Promise<AxiosResponse | any> => {
  try {
    return await API.get("/admin/category_management", {
      params: {
        searchQuery,
        statusFilter,
        sortField,
        sortOrder,
        page,
        limit,
      },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error?.message : String(error));
  }
};
export const fetchCreateCategory = async (
  category: string
): Promise<AxiosResponse | any> => {
  try {
    return await API.post(`/admin/create_category`, {
      category,
    });
  } catch (error: unknown) {
      errorHandler(error);
    console.log(error instanceof Error ? error?.message : String(error));
  }
};
export const fetchAllMentee = async (
  search: string,
  sortField: string,
  sortOrder: string,
  statusFilter: string,
  page: number,
  limit: number
): Promise<AxiosResponse | any> => {
  try {
    return await API.get(`/admin/mentee_management`, {
      params: {
        search,
        sortField,
        sortOrder,
        statusFilter,
        page,
        limit,
      },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error?.message : String(error));
  }
};
export const ToggleMenteeStatus = async (
  id: string
): Promise<AxiosResponse | any> => {
  try {
    return await API.patch(`/admin/mentee_management/change_mentee_status`, {
      id,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error?.message : String(error));
  }
};
export const fetchMentorData = async (
  searchQuery: string,
  activeTab: string,
  sortField: string,
  sortOrder: string,
  currentPage: number,
  PAGE_LIMIT: number
): Promise<AxiosResponse | any> => {
  try {
    return await API.get(`/admin/mentor_management`, {
      params: {
        searchQuery,
        activeTab,
        sortField,
        sortOrder,
        page: currentPage,
        limit: PAGE_LIMIT,
      },
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};
export const fetchMentorVerify = async (
  id: string
): Promise<AxiosResponse | any> => {
  try {
    return await API.patch(`/admin/mentor_management/mentor_verify`, { id });
  } catch (error: unknown) {
    errorHandler(error);
    toast.dismiss();
    console.log(error instanceof Error ? error?.message : String(error));
  }
};
export const toggleMentorStatus = async (
  id: string
): Promise<AxiosResponse | any> => {
  try {
    return await API.patch(`/admin/mentor_management/change_mentor_status`, {
      id,
    });
  } catch (error: unknown) {
    errorHandler(error);
    toast.dismiss();
    console.log(error instanceof Error ? error?.message : String(error));
  }
};
