import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateCarouselProps {
  dates: { date: string; day_name: string }[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onPrevBatch: () => void;
  onNextBatch: () => void;
  hasNextBatch: boolean;
  hasPrevBatch: boolean;
}

export function DateCarousel({
  dates,
  selectedDate,
  onDateSelect,
  onPrevBatch,
  onNextBatch,
  hasNextBatch,
  hasPrevBatch,
}: DateCarouselProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg">
      <button
        onClick={onPrevBatch}
        disabled={!hasPrevBatch}
        className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
          !hasPrevBatch ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      <div className="flex gap-2 flex-1 justify-center">
        {dates.map((date) => (
          <button
            key={date.date}
            onClick={() => onDateSelect(date.date)}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all ${
              selectedDate === date.date
                ? "bg-primary text-white shadow-md"
                : "bg-gray-50 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="text-sm font-medium">{date.day_name}</span>
            <span className="text-xs">{date.date.split(",")[0]}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onNextBatch}
        disabled={!hasNextBatch}
        className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
          !hasNextBatch ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}
