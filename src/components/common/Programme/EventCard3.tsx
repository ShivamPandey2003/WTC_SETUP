import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Bell, Calendar, Info, MapPin, Paperclip } from "lucide-react";
import IMG1 from '@/assets/Images/Image1.png'
import IMG2 from '@/assets/Images/Image2.png'

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

export function EventCard3({
  time,
  title,
  description,
  location,
  speakers,
  isFirst,
  isLast,
  selected,
  setSeleced
}: EventCardProps) {

    const images = [IMG1, IMG2]
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
      <div className="flex flex-col items-center relative">
        {!isFirst && (
          <div
            className={cn(
              "w-0.5 bg-gray-300 h-14 -mt-14",
              selected === title && "h-14 -mt-14"
            )}
          />
        )}

        <div className="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0 z-10" />

        {!isLast && (
          <div
            className={cn(
              "w-0.5 bg-gray-300 flex-grow min-h-[140px]",
              selected === title && "h-[170px]"
            )}
          />
        )}
      </div>
      <div 
      onClick={()=>setSeleced(pre=>Value(pre))}
      className="bg-bgCard rounded-lg shadow-sm border border-border p-3 min-w-4xl cursor-pointer"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">{time}</div>

            <h2 className="font-semibold text-gray-900 mb-2">
              {title}
            </h2>

            <p className="text-gray-600 mb-2 text-xs">{description}</p>

            {selected === title && <Button variant={'link'} size={'sm'}>
                <Paperclip/>Paper
            </Button>}

            <div className="flex flex-wrap gap-4 text-sm">
              <Button size={'sm'} variant={'link'}>
                <MapPin className="w-4 h-4" />
                {location}
              </Button>

              <Button size={'sm'} variant={'link'}>
                <Calendar className="w-4 h-4" />
                Add to calendar
              </Button>

              <Button size={'sm'} variant={'link'}>
                <Bell className="w-4 h-4" />
                Notify me
              </Button>

              <Button size={'sm'} variant={'link'}>
                <Info className="w-4 h-4" />
                More info
              </Button>
            </div>
          </div>

          <div className="flex gap-4 ml-6">
            {speakers.split("&").map((speaker, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border-2 border-gray-100">
                  <img
                    src={images[index]}
                    alt={speaker}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center">
                  {speaker}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
