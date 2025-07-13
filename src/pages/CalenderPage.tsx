import { useEffect, useState } from "react";
import {
  Calendar,
  type Event as RBCEvent,
  type View,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { localizer } from "../utils/calender";
import { setAppointments } from "../redux/appointmentsSlice";
import type { Appointment } from "../types/appointment";
import Modal from "../components/Modal";
import AppointmentForm from "../components/AppointmentForm";
import patients from "../data/patients.json";
import doctors from "../data/doctors.json";
import { format } from "date-fns";
import CalendarEventComponent from "../components/CalenderEventComponent";
import CustomToolbar from "../components/CustomToolbar";
import { v4 as uuidv4 } from "uuid";
import MobileCalendarView from "../components/MobileCalender";

function generateDummyAppointments(): Appointment[] {
  const generated: Appointment[] = [];
  const today = new Date();


  const patientsCopy = [...patients];
  const doctorsCopy = [...doctors];

  for (let i = -3; i <= 3; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const count = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < count; j++) {
      const hour = 9 + Math.floor(Math.random() * 8);
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start.getTime() + 30 * 60 * 1000);

      const randomPatient = patientsCopy[Math.floor(Math.random() * patientsCopy.length)];
      const randomDoctor = doctorsCopy[Math.floor(Math.random() * doctorsCopy.length)];

      generated.push({
        id: uuidv4(),
        start,
        end,
        patientId: randomPatient.id,
        doctorId: randomDoctor.id,
      });
    }
  }

  return generated;
}



export default function CalendarPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileCalendarView /> : <DesktopCalendarPage />;
}

function DesktopCalendarPage() {
  const dispatch = useDispatch();
  const appointments = useSelector(
    (state: RootState) => state.appointments.data
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(
    null
  );
  const [filterPatient, setFilterPatient] = useState<string>("all");
  const [filterDoctor, setFilterDoctor] = useState<string>("all");
  const [calendarView, setCalendarView] = useState<View>("month");
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) {
      dispatch(setAppointments(JSON.parse(stored)));
    } else {
      const dummyData = generateDummyAppointments();
      dispatch(setAppointments(dummyData));
      localStorage.setItem("appointments", JSON.stringify(dummyData));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const filteredAppointments = appointments.filter((app) => {
    return (
      (filterPatient === "all" || app.patientId === filterPatient) &&
      (filterDoctor === "all" || app.doctorId === filterDoctor)
    );
  });

  const events: RBCEvent[] = filteredAppointments.map((app) => {
    const patient =
      patients.find((p) => p.id === app.patientId)?.name || "Unknown";
    const doctor =
      doctors.find((d) => d.id === app.doctorId)?.name || "Unknown";

    return {
      ...app,
      title: `${patient} with ${doctor}`,
      start: new Date(app.start),
      end: new Date(app.end),
      resource: {
        time: format(app.start, "hh:mm a"),
        patient,
        doctor,
      },
    };
  });

  const handleSelectEvent = (event: RBCEvent) => {
    setSelectedDate(event.start ?? null);
    setEditAppointment(event as Appointment);
    setShowModal(true);
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setEditAppointment(null);
    setShowModal(true);
  };

  return (
    <div className="px-4 py-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4 text-center">
        Appointment Calendar
      </h2>

      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Patient
            </label>
            <select
              value={filterPatient}
              onChange={(e) => setFilterPatient(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Patients</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Doctor
            </label>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {(filterPatient !== "all" || filterDoctor !== "all") && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterPatient("all");
                  setFilterDoctor("all");
                }}
                className="w-full px-4 py-2 rounded-lg bg-gray-200 text-sm text-gray-700 hover:bg-gray-300 font-semibold transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[350px] bg-white rounded-xl shadow-lg p-4">
          <Calendar
            localizer={localizer}
            date={calendarDate}
            onNavigate={(newDate) => setCalendarDate(newDate)}
            view={calendarView}
            onView={(view) => setCalendarView(view)}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            style={{ height: 600, minWidth: "100%" }}
            components={{
              event: ({ event }) => (
                <CalendarEventComponent
                  time={event.resource.time}
                  patient={event.resource.patient}
                  doctor={event.resource.doctor}
                  title=""
                />
              ),
              toolbar: (props) => (
                <CustomToolbar {...props} view={calendarView} />
              ),
            }}
          />
        </div>
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
