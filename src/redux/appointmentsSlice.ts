import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Appointment } from "../types/appointment";

interface AppointmentsState {
  data: Appointment[];
}

const initialState: AppointmentsState = {
  data: [],
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.data.push(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      state.data = state.data.map(app =>
        app.id === action.payload.id ? action.payload : app
      );
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(app => app.id !== action.payload);
    },
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.data = action.payload;
    },
  },
});

export const {
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setAppointments,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
