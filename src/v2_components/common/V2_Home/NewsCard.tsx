import { cn } from "@/lib/utils";
import V2_LineClamp from "@/v2_components/global/V2_LineClamp";
import ExPlaceholderImg from '@/assets/Images/EXPlaceholder.jpg'

interface NewsCardProps {
  title: string;
  description: string;
  className?: string;
  index?: number;
  bg_img: string | null;
  onClick: () => void;
}

export default function NewsCard({
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
      <img
        src={
          bg_img
            ? bg_img
            : ExPlaceholderImg
        }
        alt=""
        className="w-full h-[5.5rem] object-cover rounded-t-xl object-center"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-3">{title}</h3>
        <V2_LineClamp onClick={onClick} text={description}/>
      </div>
    </div>
  );
}
