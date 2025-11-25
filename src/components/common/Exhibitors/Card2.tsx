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

const Card2: React.FC<Props> = ({ full_name, logo, url, email }) => {
  return (
    <div className="w-[130px] md:w-fit rounded-lg border border-[#0000000D] bg-[#D9D9D90D] flex flex-col md:flex-row md:items-center gap-2 justify-center p-2">
      <img src={logo} alt="test" className="w-20 h-20 mx-auto md:mx-0" />
      <div>
        <div className="flex items-center gap-3 justify-center mb-2 cursor-pointer">
          <h3 className="text-[14px] font-medium leading-5">{full_name}</h3>
          <a href={url} target="_blank">
            <ExternalLink size={16} />
          </a>
        </div>
        <div className="flex items-center gap-1 cursor-pointer mb-1">
          <Map_Pin size={9} />
          <h2 className="text-[9px] font-medium">Booth 10.1</h2>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <a href={`mailto:${email}`} className="flex items-center gap-1">
            <Mail size={9} />
            <h2 className="text-[9px] font-medium">Connect</h2>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card2;
