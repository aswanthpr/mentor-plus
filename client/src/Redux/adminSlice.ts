import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IadminToken = {
  adminToken: localStorage.getItem("adminToken") || "",
  adminRole: localStorage.getItem("adminRole") || "",
};

const adminSlice = createSlice({
  name: "adminAccess",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{ adminToken: string; adminRole: string }>
    ) => {
      state.adminToken = action.payload?.adminToken;
      state.adminRole = action.payload?.adminRole;
      localStorage.setItem("adminToken", action.payload?.adminToken);
      localStorage.setItem("adminRole", action.payload?.adminRole);
    },
    clearToken: (state) => {
     
      state.adminToken = "";
      state.adminRole = "";
      localStorage?.removeItem("adminToken");
      localStorage?.removeItem("adminRole");
    },
  },
});

export const { setToken, clearToken } = adminSlice.actions;
export default adminSlice?.reducer;
