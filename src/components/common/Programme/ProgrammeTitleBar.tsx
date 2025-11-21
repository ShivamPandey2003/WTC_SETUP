import {
  cn,
  filterDates,
  formatDate,
  getNewDatesInRangeFormatted,
} from "@/lib/utils";
import { CalendarDays, Navigation } from "lucide-react";
import type React from "react";
import { DateCarousel } from "./DateCarousal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";
import { setSelectedDate } from "@/redux/GlobalSlice";

type props = {
  className?: string;
};

const ProgrammeTitlabar: React.FC<props> = ({ className }) => {
  const {
    selectedDate,
    conference_start_date,
    conference_end_date,
    conference_title,
    conference_location,
  } = useSelector((state: RootState) => state.Global_Slice);
  const dispatch = useDispatch<AppDispatch>();
  const todayDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const [currentBatch, setCurrentBatch] = useState(0);

  const Dates = filterDates(
    getNewDatesInRangeFormatted(conference_start_date, conference_end_date)
  );

  const getCurrentBatchDates = () => {
    const startIndex = currentBatch * 7;
    return Dates.slice(startIndex, startIndex + 7);
  };

  const totalBatches = Math.ceil(Dates.length / 7);
  const hasNextBatch = currentBatch < totalBatches - 1;
  const hasPrevBatch = currentBatch > 0;

  const handleNextBatch = () => {
    if (hasNextBatch) {
      const newBatch = currentBatch + 1;
      setCurrentBatch(newBatch);
      const newBatchDates = Dates.slice(newBatch * 7, (newBatch + 1) * 7);
      if (newBatchDates.length > 0) {
        dispatch(setSelectedDate(newBatchDates[0].date));
      }
    }
  };

  const handlePrevBatch = () => {
    if (hasPrevBatch) {
      const newBatch = currentBatch - 1;
      setCurrentBatch(newBatch);
      const newBatchDates = Dates.slice(newBatch * 7, (newBatch + 1) * 7);
      if (newBatchDates.length > 0) {
        dispatch(setSelectedDate(todayDate));
      }
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-0",
        className
      )}
    >
      <h2 className="font-semibold text-[20px]">{conference_title}</h2>
      <DateCarousel
        dates={getCurrentBatchDates()}
        selectedDate={selectedDate}
        onDateSelect={(e) => dispatch(setSelectedDate(e))}
        onPrevBatch={handlePrevBatch}
        onNextBatch={handleNextBatch}
        hasNextBatch={hasNextBatch}
        hasPrevBatch={hasPrevBatch}
      />
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} />
          <h3 className="font-medium">
            {`${formatDate(conference_start_date)} - ${formatDate(
              conference_end_date
            )}`}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Navigation size={18} color="black" fill="black" />
          <h3 className="font-medium">{conference_location}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeTitlabar;
