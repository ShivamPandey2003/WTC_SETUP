import { cn } from "@/lib/utils";

interface NewsCardProps {
  title: string;
  description: string;
  className?: string;
}

export default function NewsCard({ title, description, className }: NewsCardProps) {
  return (
    <div className={cn("bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
    </div>
  );
}
