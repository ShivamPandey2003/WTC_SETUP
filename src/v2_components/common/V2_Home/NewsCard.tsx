import { cn } from "@/lib/utils";
import V2_LineClamp from "@/v2_components/global/V2_LineClamp";
import ExPlaceholderImg from "@/assets/Images/EXPlaceholder.jpg";
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
        "bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer min-h-[255px]",
        className,
      )}
      onClick={() => onClick()}
    >
      <div className="w-full h-[6.5rem] overflow-hidden contain-content">
        <img
          src={bg_img || ExPlaceholderImg}
          alt=""
          className="rounded-t-xl object-center object-cover"
          width={500}
          height={88}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-3">{title}</h3>
        <V2_LineClamp onClick={onClick} text={description} />
      </div>
    </div>
  );
}

export default memo(NewsCard);
