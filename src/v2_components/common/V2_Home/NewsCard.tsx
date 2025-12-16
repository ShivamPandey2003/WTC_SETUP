interface NewsCardProps {
  title: string;
  description: string;
}

export default function NewsCard({ title, description }: NewsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
    </div>
  );
}
