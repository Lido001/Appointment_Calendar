import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../redux/appointmentsSlice";
import type { Appointment } from "../types/appointment";
import { v4 as uuidv4 } from "uuid";
import patients from "../data/patients.json";
import doctors from "../data/doctors.json";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";

interface Props {
  selectedDate: Date;
  onClose: () => void;
  editData?: Appointment;
}

export default function AppointmentForm({
  selectedDate,
  onClose,
  editData,
}: Props) {
  const dispatch = useDispatch();

  const [patientId, setPatientId] = useState(
    editData?.patientId || patients[0].id
  );
  const [doctorId, setDoctorId] = useState(editData?.doctorId || doctors[0].id);
  const [time, setTime] = useState<Date | null>(
    editData ? new Date(editData.start) : new Date()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!time) return;

    const start = new Date(selectedDate);
    start.setHours(time.getHours(), time.getMinutes(), 0, 0);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const newAppointment: Appointment = {
      id: editData?.id || uuidv4(),
      start,
      end,
      patientId,
      doctorId,
    };

    if (editData) {
      dispatch(updateAppointment(newAppointment));
    } else {
      dispatch(addAppointment(newAppointment));
    }

    onClose();
  };

  const handleDelete = () => {
    if (editData) {
      const confirmDelete = confirm(
        "Are you sure you want to delete this appointment?"
      );
      if (confirmDelete) {
        dispatch(deleteAppointment(editData.id));
        onClose();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl  w-full max-w-md mx-auto flex flex-col gap-5"
    >
      <h2 className="text-2xl font-bold text-blue-700 text-center">
        {editData ? "Edit" : "Add"} Appointment
      </h2>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Patient
        </label>
        <select
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
        >
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Doctor</label>
        <select
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        >
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Time</label>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            value={time}
            onChange={(newValue) => setTime(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.5rem",
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </div>

      <div className="flex justify-between gap-3 mt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          {editData ? "Update" : "Add"} Appointment
        </button>

        {editData && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 transition"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
