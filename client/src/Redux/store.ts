import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import notificationSlice from "./notificationSlice";
import userSlice from "./userSlice";

const persistConfig = {
  key: "root", //key of the persist state
  storage,
  whitelist: ["user"],
  blacklist: [ "auth","notification"],
};
const rootReducer = combineReducers({
  user: userSlice,
  auth:authReducer,
  notification:notificationSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
