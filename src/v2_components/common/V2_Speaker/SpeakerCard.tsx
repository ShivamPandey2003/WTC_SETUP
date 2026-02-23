import Linkedin from "@/assets/Icons/Linkedin";

interface TeamMemberCardProps extends CreateSpeakerRequestT {
  onClick: () => void;
  profile_image: string;
}

export default function SpeakerCard({
  // title,
  bio,
  profile_image,
  prefix,
  firstname,
  lastname,
  linkedin_url,
  // image,
  // connections,
  // interactions,
  // isVerified = true,
  // linkedinUrl,
  // isLinkedin,
  onClick,
}: TeamMemberCardProps) {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 w-[250px] sm:min-w-[15rem] cursor-pointer"
      onClick={onClick}
    >
      <div className="h-[14rem] overflow-hidden bg-gray-200">
        <img
          src={
            profile_image
              ? profile_image
              : "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600"
          }
          alt={prefix + " " + firstname + " " + lastname}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="py-2 px-5">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900">
            {prefix + " " + firstname + " " + lastname}
          </h3>
          {linkedin_url && <Linkedin size={20} className="cursor-pointer" />}
        </div>

        {/* <p className="text-xs text-gray-500 font-medium mb-2">{title}</p> */}

        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{bio}</p>

        {/* <div className="flex items-center justify-between">
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
          {isLinkedin && (
            <a
              href={"#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm p-1 transition-colors duration-200"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div> */}
      </div>
    </div>
  );
}
