import { cn } from "@/lib/utils";
import React from "react";

type props = {
  title: string
  description: string
  by?: string
  classname?: string;
  //   img?: string | null;
};

const OtherCard: React.FC<props> = ({ classname, title, description, by }) => {
  return (
    <div
      className={cn(
        "h-[260px] rounded-[10px] relative border-border bg-bgCard border-[1px]",
        classname
      )}
    >
      <div className=" flex flex-col justify-between w-full h-full z-[40] p-[24px]">
        <div>
          <h2 className={cn("font-[700] text-[20px]", "text-primary")}>
            {title}
          </h2>
          <h3 className={cn("font-[600] text-[14px]", "text-primary")}>
            {by ?? "By InstaLabs, QC"}
          </h3>
        </div>
        <h3 className={cn("font-[600] text-[14px]", "text-primary line-clamp-3")}>
          {description}
          {/* Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. */}
        </h3>
      </div>
    </div>
  );
};

export default OtherCard;
