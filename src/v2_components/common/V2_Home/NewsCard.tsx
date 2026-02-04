import { cn } from "@/lib/utils";

interface NewsCardProps {
  title: string;
  description: string;
  className?: string;
  index?:number;
  onClick:()=>void
}

const dummyData = [
  "https://images.pexels.com/photos/4940642/pexels-photo-4940642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/15448073/pexels-photo-15448073/free-photo-of-crowd-on-gathering-in-hall.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
]

export default function NewsCard({ title, description, className, index, onClick }: NewsCardProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer", className)} onClick={onClick}>
      <img src={dummyData[index?index % dummyData.length:0]} alt="" className="w-full h-[7rem] object-cover rounded-t-xl object-center" />
      <div className="p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
