import React, { useState } from "react";
import { Link, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router";
import {
  useGetFloorMapList,
  useGetFloorPlan,
  useUploadFloorPlan,
} from "@/api/Venue_api/Venue_Design_api";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setShapes } from "@/redux/venueDesignV2Slice";
import { nanoid } from "nanoid";
import { Normalize } from "@/lib";

const Floor_Plan = () => {
  const [floorPlan, setFloorPlan] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<string | File>("/FloorPlan.pdf");
  const dispatch = useDispatch<AppDispatch>();
  const Navigate = useNavigate();
  const { UploadFloorPlan, isPending } = useUploadFloorPlan();
  const { FloorPlan, isPending: isFloorPlanLoaing } = useGetFloorPlan((e) =>
    setFloorPlan(`data:image/png;base64,${e}`),
  );
  const {} = useGetFloorMapList();

  const onFloorPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newForm = new FormData();
    const file = e.target.files?.[0];
    if (!file) return;

    newForm.append("file", file);
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.result) {
        setFloorPlan(fileReader.result as string);
      }
    };
    UploadFloorPlan({ form: newForm });
    fileReader.readAsDataURL(file); // 👈 this was missing
  };

  const onAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachment(file);
  };

  const GoToDesign = () => {
    if (
      floorPlan &&
      Normalize(FloorPlan?.response.floor_plan as string) !== Normalize(floorPlan)
    ) {
      dispatch(
        setShapes([
          {
            type: "IMAGE",
            id: nanoid(),
            image: floorPlan,
            x: 273.9999999999998,
            y: 91.99999999999937,
            width: 763.5740287066074,
            height: 482.87714925919124,
          },
        ]),
      );
    }
    Navigate("/venue-design/design-floor-plan");
  };

  return (
    <div className="w-full rounded-xl bg-white h-[78vh] p-4">
      <div className="mb-10">
        <div className="flex items-center gap-4">
          {!isPending ? (
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
          ) : (
            <div className="flex items-center justify-center">
              <LoaderCircle className="animate-spin text-primary" />
            </div>
          )}
          <Button onClick={GoToDesign}>Go To Design Floor Plan</Button>
        </div>
        {isFloorPlanLoaing ? (
          <Skeleton className="w-full h-[60vh]" />
        ) : (
          <img
            src={floorPlan ? floorPlan : ""}
            alt="Stage"
            className="object-contain w-full h-[60vh]"
          />
        )}
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
