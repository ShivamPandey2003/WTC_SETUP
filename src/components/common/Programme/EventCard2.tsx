import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react";
import React from "react";

interface EventCardProps {
  title: string;
  speakers: string;
  description: string;
  time: string;
  location: string;
  image: string;
  isFirst?: boolean;
  isLast?: boolean;
  selected: string | null;
  setSeleced: React.Dispatch<React.SetStateAction<string | null>>;
}

const EventCard2: React.FC<EventCardProps> = ({
  title,
  speakers,
  description,
  time,
  location,
  image,
  isFirst,
  isLast,
  selected,
  setSeleced,
}) => {

  const Value = (pre: string | null)=>{
    if(selected === title && pre !== null){
      return null
    }
    else{
      return title
    }
  }

  return (
    <div className="flex items-start gap-6 relative">
      <div className="flex flex-col items-center relative mt-2">
        {!isFirst && <div className={cn("w-0.5 bg-gray-300 h-10 -mt-10", selected === title && "h-14 -mt-14")} />}

        <div className="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0 z-10" />

        {!isLast && (
          <div className={cn("w-0.5 bg-gray-300 flex-grow min-h-[130px]",selected === title && "h-[150px]")} />
        )}
      </div>

      <div
        onClick={() => setSeleced(pre=>Value(pre))}
        className="px-3 mb-6 cursor-pointer"
      >
        <div
          className={cn(
            "text-primary font-medium mb-4",
            selected === title && "text-lg font-semibold"
          )}
        >
          {time}
        </div>

        <div className="flex gap-4">
          <div className={cn("w-[180px] h-[100px] rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center", selected === title && "w-[200px] h-[110px]")}>
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className={cn("text-[16px] font-semibold text-gray-900", selected === title && "text-[18px] font-[700]")}>
              {title}
            </h3>
            {selected !== title ? (
              <p className="text-[14px] text-text mb-2">{speakers}</p>
            ) : (
              <div className="flex items-center gap-20 my-3 transition duration-200">
                {speakers.split("&").map((speaker, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center p-1 justify-center overflow-hidden">
                      {!speaker ? (
                        <img
                          src={speaker}
                          alt={speaker}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-lg text-gray-700 font-[500]">
                      {speaker}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[12px] text-gray-500 line-clamp-2">
              {description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm items-center">
              <Button variant={"link"} size={"sm"}>
                {location}
              </Button>
              <Button variant={"link"}>Add to calendar</Button>
              <Button variant={"link"}>Notify me</Button>
              {
                selected === title ?
                <Button variant={"link"}><Paperclip/>Paper</Button>
                :
              <Button variant={"link"}>More info</Button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard2;
