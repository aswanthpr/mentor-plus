import axios from "axios";
import {store} from '../Services/store'

export const protectedAPI = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      "Content-type": "application/json",
    },
    withCredentials: true,
  });

  export const unProtectedAPI = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      "Content-type": "application/json",
    },
    withCredentials: true,
  })


  protectedAPI.interceptors.request.use(
    async (config):Promise<any> => {

      const state = store.getState();

      const token = state.accessToken.accessToken;
      console.log(token,'this is from axios');

      if (token) {
        config.headers["Authorization"] = ` bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshToken = async ():Promise<any>=> {
    try {
      const response = await protectedAPI.get("/auth/refresh-token");
      console.log("refresh token", response.data);
      return response.data;
    } catch (e:any) {
      console.log("Error",e);   
    }
  };

protectedAPI.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;

      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          
          const resp = await refreshToken();
          console.log(resp.response.data,'thsi is new access token');
          
          const access_token = resp.response.token;
          
          store.dispatch({
            type:'access/setAccessToken',
            payload:access_token
          })

          protectedAPI.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access_token}`;
          return protectedAPI(originalRequest);
        } catch (error:any) {
          store.dispatch({ type: 'auth/clearAccessToken' });
          console.log(error.message)
        }

      }
      return Promise.reject(error);
    }
  );