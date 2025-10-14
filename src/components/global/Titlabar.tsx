import { cn } from "@/lib/utils";
import { CalendarDays, Navigation } from "lucide-react";
import type React from "react";

type props = {
    className?: string
}

const Titlabar:React.FC<props> = ({className}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center gap-[10px] sm:gap-[90px]", className)}>
      <div className="flex items-center gap-2">
        <CalendarDays size={18} />
        <h3 className="font-[500]">April 02, 2026 - April 07, 2026</h3>
      </div>
      <div className="flex items-center gap-2">
        <Navigation size={18} color="black" fill="black"/>
        <h3 className="font-[500]">The Convention Center, Montreal, QC</h3>
      </div>
    </div>
  );
};

export default Titlabar;
