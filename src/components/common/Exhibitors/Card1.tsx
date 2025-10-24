import dummy from "@/assets/Images/Avatar10.png";
import { ExternalLink, Mail } from "lucide-react";
import Map_Pin from "@/assets/Icons/Map_Pin";

const Card1 = () => {
  return (
    <div
      className="w-[200px] rounded-[8px] border-[1px] border-[#0000000D] bg-[#D9D9D90D] px-4 py-2"
    >
      <img src={dummy} alt="test" className="mx-auto" />
      <div className="flex items-center gap-3 justify-center cursor-pointer">
        <h3 className="text-[14px] font-[500] leading-[20px]">Epiroc</h3>
        <ExternalLink size={16} />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1 cursor-pointer">
          <Map_Pin size={12} />
          <h2 className="text-[12px] font-[500]">Booth 10.1</h2>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <Mail size={12} />
          <h2 className="text-[12px] font-[500]">Connect</h2>
        </div>
      </div>
    </div>
  );
};

export default Card1;
