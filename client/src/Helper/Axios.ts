// import axios, { AxiosResponse } from "axios";

// const protectedAPI = axios.create({
//     baseURL: "http://localhost:3000/",
//     headers: {
//       "Content-type": "application/json",
//     },
//     withCredentials: true,
//   });


//   protectedAPI.interceptors.request.use(
//     async (config):Promise<any> => {
//       const token = getTokenFromLocalStorage();
//       if (token) {
//         config.headers["Authorization"] = ` bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   const refreshToken = async ():Promise<any>=> {
//     try {
//       const response = await protectedAPI.get("auth/refresh");
//       console.log("refresh token", response.data);
//       return response.data;
//     } catch (e:any) {
//       console.log("Error",e);   
//     }
//   };

// protectedAPI.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     async function (error) {
//       const originalRequest = error.config;
//       if (error.response.status === 403 && !originalRequest._retry) {
//         originalRequest._retry = true;
  
//         const resp = await refreshToken();
  
//         const access_token = resp.response.accessToken;
  
//         addTokenToLocalStorage(access_token);
//         protectedAPI.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${access_token}`;
//         return protectedAPI(originalRequest);
//       }
//       return Promise.reject(error);
//     }
//   );