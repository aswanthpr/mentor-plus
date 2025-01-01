import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { store } from '../Redux/store';
import { setAccessToken } from '../Redux/menteeSlice';

// Initialize Axios instances
export const protectedAPI = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true, // This is required for sending cookies
});

export const unProtectedAPI = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

// Request interceptor to add Authorization header if token exists
protectedAPI.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const accessToken = state.mentee.accessToken;

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
protectedAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await unProtectedAPI.post(`/mentee/refresh-token`);
        store.dispatch(setAccessToken({ accessToken: data?.accessToken, role: 'mentee' }));

        // Update Authorization header for the current request
        originalRequest.headers['Authorization'] = `Bearer ${data?.accessToken}`;

        return protectedAPI(originalRequest);
      } catch (refreshError: any) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
