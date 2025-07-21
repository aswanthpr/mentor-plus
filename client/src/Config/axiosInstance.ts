import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "../Redux/store";
import { clearAuth, setAuth } from "../Redux/authSlice";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: { "Content-type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = store.getState().auth;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const { role } = store.getState().auth;

    if (error.response?.status === 401) {
      store.dispatch(clearAuth());
      return Promise.reject(error);
    }

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshUrlMap = {
          admin: "/admin/refresh-token",
          mentor: "/mentor/refresh-token",
          mentee: "/mentee/refresh-token",
        } as const;

        type Role = keyof typeof refreshUrlMap; // "admin" | "mentor" | "mentee"

        if (!role || !(role in refreshUrlMap)) {
          throw new Error("Invalid role provided for refresh URL");
        }
        const refreshUrl = refreshUrlMap[role as Role];
        const { data } = await axios.post(
          refreshUrl,
          {},
          {
            baseURL: import.meta.env.VITE_SERVER_URL,
            withCredentials: true,
          }
        );

        store.dispatch(setAuth({ token: data.accessToken, role }));

        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        store.dispatch(clearAuth());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
