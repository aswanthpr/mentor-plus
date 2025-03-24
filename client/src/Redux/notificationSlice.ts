import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: Inotify = {
  mentee: [],
  mentor: [],
  admin: [],
};

const notificaitonSlice = createSlice({
  name: "notificaitons",
  initialState,
  reducers: {
    addNewNotification: (
      state,
      action: PayloadAction<{
        userType: Inotification["userType"];
        notification: Inotification;
      }>
    ) => {
      state[action.payload.userType].unshift(action.payload.notification);
    },
    markAsRead: (
      state,
      action: PayloadAction<{
        userType: Inotification["userType"];
        id: Inotification["_id"];
      }>
    ) => {
      const { userType, id } = action.payload;

      const notificaiton = state[userType].find((noti) => noti?._id === id);
      if (notificaiton) {
        notificaiton.isRead = true;
      }
    },
    setNotification: (
      state,
      action: PayloadAction<{
        userType: Inotification["userType"];
        notification: Inotification[];
      }>
    ) => {
      const { userType, notification } = action.payload;

      state[userType] = notification;
    },
  },
});

export const { addNewNotification, markAsRead, setNotification } =
  notificaitonSlice.actions;
export default notificaitonSlice?.reducer;