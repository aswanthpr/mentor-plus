import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAccessToken {
  accessToken: string;
  role: string;
}
 
const initialState: IAccessToken = {
  accessToken: localStorage.getItem("authToken") || "", 
  role: localStorage.getItem("role") || "",
};

const accessSlice = createSlice({
  name: "access",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<{accessToken:string,role:string}>) => {
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.role;
      localStorage.setItem("authToken", action.payload.accessToken);
      localStorage.setItem("role", action.payload.role);
    },
    clearAccessToken: (state) => {
      state.accessToken = "";
      state.role = "";
      localStorage.removeItem("authToken");
      localStorage.removeItem("role"); 
    },
  },
});

export const { setAccessToken, clearAccessToken } = accessSlice?.actions;
export default accessSlice?.reducer;
