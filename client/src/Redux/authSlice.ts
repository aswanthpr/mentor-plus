import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAuthState {
  token: string;
  role: "admin" | "mentor" | "mentee" | "";
}

const initialState: IAuthState = {
  token: localStorage.getItem("authToken") || "",
  role: (localStorage.getItem("authRole") as IAuthState["role"]) || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<IAuthState>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("authRole", action.payload.role);
    },
    clearAuth: (state) => {
      state.token = "";
      state.role = "";
      localStorage.removeItem("authToken");
      localStorage.removeItem("authRole");
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
