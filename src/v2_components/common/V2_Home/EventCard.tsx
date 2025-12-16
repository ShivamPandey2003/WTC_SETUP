import { Clock } from 'lucide-react';

interface EventCardProps {
  title: string;
  time: string;
  description: string;
  tags: string[];
}

export default function EventCard({ title, time, description, tags }: EventCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>

      <div className="flex items-center text-sm text-gray-600 mb-3">
        <Clock className="w-4 h-4 mr-2" />
        <span>{time}</span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}