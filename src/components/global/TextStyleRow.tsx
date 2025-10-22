import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface TextStyleRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  Icons?: LucideIcon;
  classname?: string;
}

export default function TextStyleRow({
  label,
  value,
  onChange,
  Icons,
  classname,
}: TextStyleRowProps) {
  return (
    <div className="flex items-center py-2">
      <div className="w-40 text-sm font-[500]">{label}</div>
      <div
        className={cn(
          "relative flex w-fit items-center gap-3 bg-[#1111110D] px-12 py-1 text-sm text-gray-600 rounded-[7px] text-center border border-transparent hover:border-gray-300 focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors",
          classname
        )}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="focus:outline-none w-full text-center"
        />
        {Icons && <Icons className="absolute right-2" size={20} />}
      </div>
    </div>
  );
}
