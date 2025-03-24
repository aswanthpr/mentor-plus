import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState: ImentorToken = {
  mentorToken: localStorage.getItem("mentorToken") || "",
  mentorRole: localStorage.getItem("mentor") || "",
};

const mentorSlice = createSlice({
  name: "mentor",
  initialState,
  reducers: {
    setMentorToken: (
      state,
      action: PayloadAction<{ mentorToken: string; mentorRole: string }>
    ) => {
      state.mentorToken = action.payload.mentorToken;
      state.mentorRole = action.payload.mentorRole;
      localStorage.setItem("mentorToken", action.payload.mentorToken);
      localStorage.setItem("mentor", action.payload.mentorRole);
    },
    clearMentorToken: (state) => {
      state.mentorToken = "";
      state.mentorRole = "";
      localStorage.removeItem("mentorToken");
      localStorage.removeItem("mentor");
    },
  },
});

export const { setMentorToken, clearMentorToken } = mentorSlice.actions;
export default mentorSlice?.reducer;
