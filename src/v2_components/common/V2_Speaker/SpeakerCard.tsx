import { Users, MessageCircle, Linkedin, CheckCircle } from "lucide-react";

interface TeamMemberCardProps {
  name: string;
  title: string;
  description: string;
  image: string;
  connections: number;
  interactions: number;
  isVerified?: boolean;
  linkedinUrl?: string;
}

export default function SpeakerCard({
  name,
  title,
  description,
  image,
  connections,
  interactions,
  isVerified = true,
  linkedinUrl,
}: TeamMemberCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 max-w-xs sm:min-w-[15rem]">
      <div className="h-[14rem] overflow-hidden bg-gray-200">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="py-2 px-5">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          {isVerified && <CheckCircle className="w-5 h-5 text-green-500" />}
        </div>

        <p className="text-xs text-gray-500 font-medium mb-2">{title}</p>

        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-900">
                {connections}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-900">
                {interactions}
              </span>
            </div>
          </div>
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm p-1 transition-colors duration-200"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
