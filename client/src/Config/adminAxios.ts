import axios,{AxiosError, InternalAxiosRequestConfig} from "axios";
import {store} from '../Redux/store'
import { setToken } from "../Redux/adminSlice";

// Initialize Axios instances
export const API = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,//this is required to sending cookies
});
export const unAPI = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true
});
//request interceptor to add Authorization header if token exist
API.interceptors.request.use(
  async (config:InternalAxiosRequestConfig): Promise<any> => {
    const state = store.getState();
    const adminToken = state.admin.adminToken;
    console.log(adminToken, "this is from axios,in redux accesstoken");

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
    async  (error:AxiosError)=>{
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 403 && !originalRequest?._retry) {
        originalRequest._retry = true;
        try {
          
          const {data} = await API.post(`/admin/refresh-token`);
          console.log(data,'thsi is new access token');

          store.dispatch(setToken({adminToken:data?.accessToken,adminRole:'admin'}));
          axios.defaults.headers.common['Authorization']=`Bearer ${data?.accessToken}`

          return API(originalRequest);
        } catch (error:any) {

          return Promise.reject(error);
        }

      }
      return Promise.reject(error);
    }
  );