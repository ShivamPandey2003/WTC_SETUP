import { cn } from "@/lib/utils";
import React from "react";

type prop = {
  //   title: string;
  img?: string;
  classname?: string;
};

const BannerPreview: React.FC<prop> = ({ img, classname }) => {
  return (
    <div
      className={cn(
        "h-[100px] w-1/2 rounded-[10px] relative border-border",
        img
          ? `bg-[url('./Banner1.png')] bg-fill md:bg-cover bg-center`
          : "bg-bgCard border-[1px]",
        classname
      )}
    >
      {img && (
        <div className="bg-linear-to-b from-transparent to-primary absolute top-0 right-0 z-[30] w-full h-full rounded-b-[10px]" />
      )}
      <div className=" absolute flex flex-col justify-end w-full h-full z-[40] p-[12px]">
        <h2
          className={cn(
            "font-[700] text-[10px]",
            !img ? "text-primary" : "text-white"
          )}
        >
          Technology & Innovation
        </h2>
        <h3
          className={cn(
            "font-[600] text-[7px]",
            !img ? "text-primary" : "text-white"
          )}
        >
          By InstaLabs, QC
        </h3>
        <h3
          className={cn(
            "font-[600] text-[7px]",
            !img ? "text-primary" : "text-white"
          )}
        >
          April 3, 2026 - April 7, 2026
        </h3>
      </div>
    </div>
  );
};

export default BannerPreview;
