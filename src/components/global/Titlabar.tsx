import { cn } from "@/lib/utils";
import { CalendarDays, Navigation } from "lucide-react";
import type React from "react";
import { useLocation } from "react-router";

type props = {
  title?: string;
  className?: string;
  date?: string;
  location?: string;
};

const Titlabar: React.FC<props> = ({ className, title, date, location }) => {
  const {pathname} = useLocation()
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-0",
        className
      )}
    >
      {(pathname !== "/venue" && pathname !=="/profile")&&<h2 className="font-semibold text-[20px]">{title??"Conference Programme"}</h2>}
      {pathname === "/profile" && <h2 className="font-semibold text-[20px]">{"John Doe's"} {"ITA WTC Profile"}</h2>}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-[90px]">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} />
          <h3 className="font-medium">{date??"April 02, 2026 - April 07, 2026"}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Navigation size={18} color="black" fill="black" />
          <h3 className="font-medium">{location??"The Convention Center, Montreal, QC"}</h3>
        </div>
      </div>
    </div>
  );
};

export default Titlabar;
