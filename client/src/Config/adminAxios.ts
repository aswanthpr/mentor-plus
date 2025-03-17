import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from '../Redux/store'
import { clearToken, setToken } from "../Redux/adminSlice";

// Initialize Axios instances
export const API = axios.create({
  baseURL:import.meta.env.VITE_SERVER_URL, 
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,//this is required to sending cookies
});
export const unAPI = axios.create({
  baseURL:import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true
});
//request interceptor to add Authorization header if token exist
API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const adminToken = state.admin.adminToken;


    if (adminToken) {
      config.headers["Authorization"] = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);

  }
);


API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
console.log(error,'error aane')
    if (error.response?.status === 401) {

      store.dispatch(clearToken());

      return Promise.reject(error);
    }

    if (error.response?.status === 403 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {

        const { data } = await API.post(`/admin/refresh-token`);


        store.dispatch(setToken({ adminToken: data?.accessToken, adminRole:'admin'}));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data?.accessToken}`

        return API(originalRequest);
      } catch (refreshError: unknown) {
        if (refreshError instanceof AxiosError) {
          console.error('Error during token refresh:', refreshError.response?.data);
        }
        return Promise.reject(error);
      }

    }
    return Promise.reject(error);
  }
);