// import dummy from "@/assets/Images/Dummy.png";
import { ExternalLink, Mail } from "lucide-react";
import Map_Pin from "@/assets/Icons/Map_Pin";
import type React from "react";

type Props = {
  full_name: string;
  logo: string;
  url: string;
  email: string;
};

const Card1: React.FC<Props> = ({ full_name, logo, url, email }) => {
  return (
    <div className="w-[130px] sm:w-[200px] rounded-lg border border-[#0000000D] bg-[#D9D9D90D] px-4 py-2">
      <img src={logo} alt="test" className="mx-auto" />
      <div className="flex items-center gap-3 justify-center cursor-pointer">
        <h3 className="text-[14px] font-medium leading-5">{full_name}</h3>
        <a href={url}>
          <ExternalLink size={16} />
        </a>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
        <div className="flex items-center gap-1 cursor-pointer">
          <Map_Pin size={12} />
          <h2 className="text-[12px] font-medium">Booth 10.1</h2>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <a href={`mailto:${email}`} className="flex items-center gap-1">
            <Mail size={12} />
            <h2 className="text-[12px] font-medium">Connect</h2>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card1;
