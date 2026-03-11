import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface TextStyleRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  Icons?: LucideIcon;
  classname?: string;
  containerClassname?: string;
}

export default function TextStyleRow({
  label,
  value,
  onChange,
  Icons,
  classname,
  containerClassname,
}: TextStyleRowProps) {
  return (
    <div className={cn("flex items-center gap-4 py-2", containerClassname)}>
      <div className="text-sm font-[500] w-[220px] shrink-0">{label}</div>

      <div
        className={cn(
          "relative flex items-center gap-3 bg-[#1111110D] px-12 py-1 text-sm text-gray-600 rounded-[7px] text-center border border-transparent hover:border-gray-300 focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors",
          classname,
        )}
      >
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="focus:outline-none text-center bg-transparent"
        />
        {Icons && <Icons className="absolute right-2" size={20} />}
      </div>
    </div>
  );
}
