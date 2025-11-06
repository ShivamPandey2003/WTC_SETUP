import Linkedin from "@/assets/Icons/Linkedin";
import React from "react";

type prop = {
  name: string;
  image?: string;
  bio: string;
  company: string;
};

const SpeakerCard: React.FC<prop> = ({ name, image, bio, company }) => {
  return (
    <div className="flex flex-col items-center bg-[#31806105] p-2 border rounded-md border-[#31806126]">
      <img src={image} className="w-[120px] h-[120px] my-2" />
      <div className="flex gap-2 items-center justify-center">
        <Linkedin size={20} />
        <h2
          className="text-primary font-[700] text-[18px]"
        >
          {name}
        </h2>
      </div>
      <h3 className="text-text mb-2 text-center text-[14px]">
        {company}
      </h3>
      <h3 className="text-sm text-center text-text line-clamp-2">
        {bio}
      </h3>
    </div>
  );
};

export default SpeakerCard;
