import { FiClock, FiUser } from "react-icons/fi";
import { MdMedicalServices } from "react-icons/md";

interface Props {
  title: string;
  time: string;
  patient: string;
  doctor: string;
}

export default function CalendarEventComponent({
  time,
  patient,
  doctor,
}: Props) {
  return (
    <div className="text-sm leading-tight space-y-1 ">
      <div className="flex items-center gap-1 text-white font-semibold">
        <FiUser className="text-white/50" />
        <span className="truncate max-w-[140px]">{patient}</span>
      </div>
      <div className="flex items-center gap-1 text-white">
        <MdMedicalServices className="text-white/50" />
        <span className="truncate max-w-[140px]">{doctor}</span>
      </div>
      <div className="flex items-center gap-1 text-white">
        <FiClock className="text-white/50" />
        <span>{time}</span>
      </div>
    </div>
  );
}
