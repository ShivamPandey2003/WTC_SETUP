import { cn } from "@/lib/utils";

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
        "bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer",
        className,
      )}
      onClick={() => onClick()}
    >
      <img
        src={
          bg_img
            ? `data:image/png;base64,${bg_img}`
            : "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200"
        }
        alt=""
        className="w-full h-[7rem] object-cover rounded-t-xl object-center"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
