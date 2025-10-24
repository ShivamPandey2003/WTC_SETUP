import { cn } from "@/lib/utils";
import React from "react";

interface Custom_Text_RowProp {
  index: string;
  value: string;
  color: string;
  classname?:string
}

const Custom_Text_Row: React.FC<Custom_Text_RowProp> = ({
  index,
  value,
  color,
  classname
}) => {
  return (
    <div className={cn("flex items-center gap-2 my-2", classname)}>
      <div>{index}.</div>
      <div className="w-[200px] h-[30px] rounded-[7px] bg-[#1111110D] flex items-center justify-center mr-2">
        {value}
      </div>
      <div
        className="w-6 h-6 rounded border border-gray-300"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-gray-600">{color}</span>
    </div>
  );
};

export default Custom_Text_Row;
