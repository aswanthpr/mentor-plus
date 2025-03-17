import axios,{ AxiosError, InternalAxiosRequestConfig} from "axios";
import {store} from '../Redux/store'
import { clearMentorToken, setMentorToken } from "../Redux/mentorSlice";

// Initialize Axios instances
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,//this is required to sending cookies
});



//request interceptor to add Authorization header if token exist
axiosInstance.interceptors.request.use(
  async (config:InternalAxiosRequestConfig) => {
    const state = store.getState();
    const accessToken = state?.menter?.mentorToken

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

      if(error.response?.status==401){//&&!error.response?.data?.success
        store.dispatch(clearMentorToken());
        return Promise.reject(error);
      }

      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          
          const {data} = await axiosInstance.post(`/mentor/refresh-token`);
          

          store.dispatch(setMentorToken({mentorToken:data?.accessToken,mentorRole:'mentor'}));
          axios.defaults.headers.common['Authorization']=`Bearer ${data?.accessToken}`

          return axiosInstance(originalRequest);
        } catch (error:unknown) {
          console.log(`${error instanceof AxiosError ?error.message:String(error)}`)
          return Promise.reject(error);
        }

      }
      return Promise.reject(error);
    }
  );