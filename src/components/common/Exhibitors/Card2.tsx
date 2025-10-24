import dummy from "@/assets/Images/Avatar10.png";
import { ExternalLink, Mail } from "lucide-react";
import Map_Pin from "@/assets/Icons/Map_Pin";

const Card2 = () => {
  return (
    <div className="w-[300px] rounded-[8px] border-[1px] border-[#0000000D] bg-[#D9D9D90D] flex items-center gap-2 justify-center p-2">
      <img src={dummy} alt="test" className="w-[100px]" />
      <div>
        <div className="flex items-center gap-3 justify-center mb-2 cursor-pointer">
          <h3 className="text-[14px] font-[500] leading-[20px]">Epiroc</h3>
          <ExternalLink size={16} />
        </div>
        <div className="flex items-center gap-1 cursor-pointer mb-1">
          <Map_Pin size={9} />
          <h2 className="text-[9px] font-[500]">Booth 10.1</h2>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <Mail size={9} />
          <h2 className="text-[9px] font-[500]">Connect</h2>
        </div>
      </div>
    </div>
  );
};

export default Card2;
