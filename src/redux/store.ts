import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import appointmentsReducer from "./appointmentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
