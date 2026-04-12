import { cn } from "@/lib/utils";
import V2_LineClamp from "@/v2_components/global/V2_LineClamp";
import NewUpdatePlacerholder from "@/assets/Images/new-update-banner-template-ribbon-label-placeholder.png";
import { memo } from "react";

interface NewsCardProps {
  title: string;
  description: string;
  className?: string;
  index?: number;
  bg_img: string | null;
  onClick: () => void;
}

function NewsCard({
  title,
  description,
  className,
  bg_img,
  onClick,
}: NewsCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer h-[28vh]",
        className,
      )}
      onClick={() => onClick()}
    >
      <div className="flex rounded-t-xl w-full h-4/7 overflow-hidden contain-content items-center justify-center">
        {bg_img && bg_img !== "" && bg_img !== undefined 
          ?
          <img
            src={bg_img || NewUpdatePlacerholder}
            alt=""
            className="rounded-t-xl object-top object-cover w-full"
            loading="lazy"
            decoding="async"
          />
          :
          <img
            src={NewUpdatePlacerholder}
            alt="New Update"
            className="rounded-t-xl object-contain h-full object-top"
            loading="lazy"
            decoding="async"
          />
        }
      </div>
      <div className="pb-2 pr-4 pl-4 pt-2 h-3/7 flex flex-col justify-center">
        <h3 className="font-bold text-gray-900 mb-1 truncate">{title}</h3>
        <V2_LineClamp onClick={onClick} text={description} />
      </div>
    </div>
  );
}

export default memo(NewsCard);
