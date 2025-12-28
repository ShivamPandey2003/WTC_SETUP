import React, { useState } from "react";
import Stage from "@/assets/Images/FloorPlan.png";
import { Link } from "lucide-react";

const Floor_Plan = () => {
  const [floorPlan, setFloorPlan] = useState<string>(Stage);
  const [attachment, setAttachment] = useState<string | File>("/FloorPlan.pdf");

  const onFloorPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.result) {
        setFloorPlan(fileReader.result as string);
      }
    };

    fileReader.readAsDataURL(file); // 👈 this was missing
  };

  const onAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachment(file);
  };

  return (
    <div className="w-full rounded-xl bg-white h-[78vh] p-4">
      <div className="mb-10">
        <label
          className="text-sm font-medium text-blue-500 cursor-pointer"
          htmlFor="floorfile"
        >
          Change Floor Plan
          <input
            type="file"
            className="hidden"
            id="floorfile"
            onChange={onFloorPlanChange}
            accept="image/png, image/jpeg"
          />
        </label>
        <img
          src={floorPlan}
          alt="Stage"
          className="object-contain w-full h-[60vh]"
        />
      </div>
      <div className="flex items-center space-x-8">
        <label
          className="text-sm font-medium text-blue-500 cursor-pointer"
          htmlFor="Attachmentfile"
        >
          Change Attachment
          <input
            type="file"
            className="hidden"
            id="Attachmentfile"
            accept="application/pdf"
            onChange={onAttachmentChange}
          />
        </label>
        <a
          href={
            typeof attachment === "string"
              ? attachment
              : URL.createObjectURL(attachment)
          }
          target="_blank"
          className="flex items-center text-blue-600 gap-1"
        >
          <Link size={18} /> Floor Plan
        </a>
      </div>
    </div>
  );
};

export default Floor_Plan;
