import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props {
  label: string;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  onView: (view: "month" | "week" | "day") => void;
  view: string;
}

export default function CustomToolbar({
  label,
  onNavigate,
  onView,
  view,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex flex-col items-center gap-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("PREV")}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
            title="Previous"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>

          <button
            onClick={() => onNavigate("TODAY")}
            className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-black/80 transition"
          >
            {label}
          </button>

          <button
            onClick={() => onNavigate("NEXT")}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
            title="Next"
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 text-center">{label}</h2>

      <div className="flex items-center gap-1 bg-black/99 rounded-full p-1">
        {["month", "week", "day"].map((v) => (
          <button
            key={v}
            onClick={() => onView(v as "month" | "week" | "day")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              view === v
                ? "bg-blue-600 text-white shadow"
                : "text-white hover:bg-white hover:text-black"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
