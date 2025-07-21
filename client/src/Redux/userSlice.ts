import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name: string | null;
  email: string | null;
  image: string | null;
  role: string | null;
}

const initialState: UserState = {
  name: null,
  email: null,
  image: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        image: string;
        role: string;
      }>
    ) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.image = action.payload.image;
      state.role = action.payload.role;
    },
    clearUser: (state) => {
      state.email = null;
      state.role = null;
      state.name = null;
      state.image = null;
    },
  },
});
export const { clearUser, setUser } = userSlice.actions;
export default userSlice.reducer;
