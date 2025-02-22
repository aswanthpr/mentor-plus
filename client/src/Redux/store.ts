import {configureStore} from "@reduxjs/toolkit";

import accessReducer from './menteeSlice';
import adminReducer from './adminSlice';
import menterReducer from './mentorSlice';
import notificationSlice from './notificationSlice';

export const store = configureStore({
    reducer:{
        mentee:accessReducer,
        admin:adminReducer,
        menter:menterReducer,
        notificationSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
