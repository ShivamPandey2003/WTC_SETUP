import { cn } from "@/lib/utils";
import EventGrid from "@/v2_components/common/V2_Programme/EventGrid";
import { Check } from "lucide-react";

const V2_Programme_page = () => {
  return (
    <div className="px-4 mx-auto">
      <div className="hidden sm:flex gap-4 items-center ml-16 mt-4 mb-12">
        {[
          { name: "Technical", bgColor: "#E9C5FF", borderColor: "#7064CE" },
          { name: "Activity", bgColor: "#98EEB6", borderColor: "#316C39" },
          { name: "Open", bgColor: "#FED698", borderColor: "#BF6B40" },
          { name: "Registration", bgColor: "#C7E3F4", borderColor: "#6565A5" },
          { name: "Exhibition", bgColor: "#FFA6A8", borderColor: "#834646" },
        ].map((item) => (
          <div
            key={item.name}
            className={cn(
              "flex items-center justify-center p-1 rounded-lg border w-[7.5rem] gap-2"
            )}
            style={{
              background: item.bgColor,
              borderColor: item.borderColor,
              color: item.borderColor,
            }}
          >
            <Check size={15} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <EventGrid/>
    </div>
  );
};

export default V2_Programme_page;
