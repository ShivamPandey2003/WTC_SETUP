import { Button } from '@/components/ui/Button';
import React from 'react'

interface EventCardProps {
  title: string;
  speakers: string;
  description: string;
  time: string;
  location: string;
  image: string;
  isFirst?: boolean;
  isLast?: boolean;
  setSeleced: React.Dispatch<React.SetStateAction<string | null>>
}

const EventCard1:React.FC<EventCardProps> = ({title, speakers, description, time, location,image, isFirst, isLast, setSeleced}) => {
  return (
     <div className="flex gap-6 relative">
      <div className="flex flex-col items-center relative">
        {!isFirst && (
          <div className="w-0.5 bg-gray-300 h-8 -mt-8" />
        )}

        <div className="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0 z-10" />

        {!isLast && (
          <div className="w-0.5 bg-gray-300 flex-grow min-h-[120px]" />
        )}
      </div>

      <div onClick={()=>setSeleced(title)} className="flex-1 bg-white rounded-lg p-3 mb-6 cursor-pointer">
        <div className="flex gap-4">
          <div className="w-[180px] h-[100px] rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1">
            <h3 className="text-[16px] font-semibold text-gray-900 ">{title}</h3>
            <p className="text-[14px] text-text mb-2">{speakers}</p>
            <p className="text-[12px] text-gray-500 line-clamp-2">{description}</p>

            <div className="flex flex-wrap gap-4 text-sm items-center">
              <span className="text-primary font-medium">{time}</span>
              <Button variant={'link'} size={'sm'}>
                {location}
              </Button>
              <Button variant={'link'}>
                Add to calendar
              </Button>
              <Button variant={'link'}>
                Notify me
              </Button>
              <Button variant={'link'}>
                More info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard1