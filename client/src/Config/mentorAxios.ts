import axios,{InternalAxiosRequestConfig} from "axios";
import {store} from '../Redux/store'
import { setMentorToken } from "../Redux/mentorSlice";

// Initialize Axios instances
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,//this is required to sending cookies
});



//request interceptor to add Authorization header if token exist
axiosInstance.interceptors.request.use(
  async (config:InternalAxiosRequestConfig): Promise<any> => {
    const state = store.getState();
    const accessToken = state.menter?.mentorToken
    console.log(accessToken, "this is from axios,in redux accesstoken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
    
  }
);


axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async  (error)=>{
      const originalRequest = error.config;

      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          
          const {data} = await axiosInstance.post(`/mentor/refresh-token`);
          console.log(data,'thsi is new access token');

          store.dispatch(setMentorToken({mentorToken:data?.accessToken,mentorRole:'mentor'}));
          axios.defaults.headers.common['Authorization']=`Bearer ${data?.accessToken}`

          return axiosInstance(originalRequest);
        } catch (error:any) {

          return Promise.reject(error);
        }

      }
      return Promise.reject(error);
    }
  );