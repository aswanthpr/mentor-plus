import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Inotify {
  menteeNotification: Inotification[],
  mentorNotification: Inotification[]
}
const initialState: Inotify = {
  menteeNotification: [],
  mentorNotification: [],
}

const notificaitonSlice = createSlice({
  name: "notificaitons",
  initialState,
  reducers: {
    addNewNotification: (state, action: PayloadAction<Inotification>) => {
      if (action.payload.userType === 'mentee') {
        state.menteeNotification.push(action.payload)
      } else {
        state.mentorNotification.push(action.payload)
      }
    },
    markAsRead: (state, action: PayloadAction<{ userType: Inotification['userType']; id: Inotification['_id'] }>) => {
      const { userType, id } = action.payload;
      const targetArray = userType === 'mentee' ? state.menteeNotification : state.mentorNotification;


      const notification = targetArray.find(
        (noti) => noti?._id === id
      );
      if (notification) {
        notification['isRead'] = true;
      }

    },
    setNotification: (state, action: PayloadAction<{ userType: Inotification['userType']; notification: Inotification[] }>) => {
      const { userType, notification } = action.payload;
      if (userType == 'mentee') {
        state.menteeNotification = notification
      } else {
        state.mentorNotification = notification
      }
    }
  },
});

export const { addNewNotification, markAsRead, setNotification } = notificaitonSlice.actions;
export default notificaitonSlice?.reducer;