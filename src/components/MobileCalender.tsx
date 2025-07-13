import { useState, useEffect } from "react";
import { Calendar, type Event as RBCEvent } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { IconButton } from "@mui/material";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Modal from "../components/Modal";
import AppointmentForm from "../components/AppointmentForm";
import patients from "../data/patients.json";
import doctors from "../data/doctors.json";
import { localizer } from "../utils/calender";
import { useDispatch, useSelector } from "react-redux";
import { setAppointments } from "../redux/appointmentsSlice";

import type { Appointment } from "../types/appointment";
import type { RootState } from "../redux/store";

type CustomEvent = RBCEvent & {
  resource: {
    patient: string;
    doctor: string;
    time: string;
  };
};





export default function MobileCalendarView() {
  const dispatch = useDispatch();
  const appointments = useSelector(
    (state: RootState) => state.appointments.data
  );
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(
    null
  );

  useEffect(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) {
      dispatch(setAppointments(JSON.parse(stored)));
    } else {
        const dummyData: Appointment[] = [];
        localStorage.setItem("appointments", JSON.stringify(dummyData));
        dispatch(setAppointments(dummyData));
    }
  }, [dispatch]);

  const events: CustomEvent[] = appointments.map((app) => {
    const patient =
      patients.find((p) => p.id === app.patientId)?.name || "Unknown";
    const doctor =
      doctors.find((d) => d.id === app.doctorId)?.name || "Unknown";
    const time = `${new Date(app.start).getHours()}:${String(
      new Date(app.start).getMinutes()
    ).padStart(2, "0")}`;

    return {
      ...app,
      title: `${patient} with ${doctor}`,
      start: new Date(app.start),
      end: new Date(app.end),
      resource: {
        patient,
        doctor,
        time,
      },
    };
  });

  const handleAddAppointment = () => {
    setSelectedDate(calendarDate);
    setEditAppointment(null);
    setShowModal(true);
  };

  const goToPrevDay = () => {
    const newDate = new Date(calendarDate);
    newDate.setDate(newDate.getDate() - 1);
    setCalendarDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(calendarDate);
    newDate.setDate(newDate.getDate() + 1);
    setCalendarDate(newDate);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <IconButton onClick={goToPrevDay}>
          <FiChevronLeft />
        </IconButton>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={calendarDate}
            onChange={(date) => date && setCalendarDate(date)}
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>
        <IconButton onClick={goToNextDay}>
          <FiChevronRight />
        </IconButton>
      </div>

      <button
        onClick={handleAddAppointment}
        className="w-full mb-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Add Appointment
      </button>

      <div className="bg-white rounded-xl p-4 shadow">
        <Calendar
          localizer={localizer}
          date={calendarDate}
          view="day"
          toolbar={false}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          components={{
            event: ({ event }: { event: CustomEvent }) => (
              <div className="text-sm leading-tight space-y-1">
                <div className="text-gray-800 font-medium">
                  {event.resource.patient}
                </div>
                <div className="text-gray-600">{event.resource.doctor}</div>
                <div className="text-gray-500">{event.resource.time}</div>
              </div>
            ),
          }}
        />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {selectedDate && (
          <AppointmentForm
            selectedDate={selectedDate}
            onClose={() => setShowModal(false)}
            editData={editAppointment ?? undefined}
          />
        )}
      </Modal>
    </div>
  );
}
