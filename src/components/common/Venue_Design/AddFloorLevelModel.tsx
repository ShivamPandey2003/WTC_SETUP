import { useCreateFloorLevel } from "@/api/Venue_api/Venue_Design_api";
import CustomForm from "@/components/global/CustomForm";
import Modal from "@/components/ui/Modal";
import type { AppDispatch, RootState } from "@/redux/store";
import { setFloorLevelModal } from "@/redux/venueDesignV2Slice";
import {
  FloorLevelSchema,
  type FloorLevelSchemaType,
} from "@/Schema/FloorLevelSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const AddFloorLevelModel = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({ resolver: zodResolver(FloorLevelSchema) });
  const dispatch = useDispatch<AppDispatch>();
  const { FloorLevelModal } = useSelector(
    (state: RootState) => state.Venue_Design_V2,
  );
  const [url, setUrl] = useState<boolean>(false);
  const { CreateFloorLevel, isPending } = useCreateFloorLevel();
  const designType = useWatch({
    control,
    name: "design_type",
  });

  const onSubmit = (newData: FloorLevelSchemaType) => {
    const formData = new FormData();
    formData.append("label", newData.label);
    formData.append("floor_level", String(newData.floor_level));
    formData.append("design_type", String(newData.design_type));
    if (url) {
      formData.append("iframe_url", newData.iframe_url as string);
    } else {
      formData.append("file", newData.file?.[0] as Blob);
    }

    CreateFloorLevel(formData);
    reset();
  };

  useEffect(() => {
    const value = String(designType) === "true";
    setUrl(value);
  }, [designType]);

  const fields: {
    name: keyof FloorLevelSchemaType;
    label: string;
    type?:
      | "text"
      | "textarea"
      | "number"
      | "file"
      | "checkbox"
      | "date"
      | "array-string"
      | "array-attachment"
      | "select";
    placeholder?: string;
    accept?: string;
    options?: { label: string; value: string }[];
  }[] = [
    { name: "label", label: "Label", placeholder: "Enter Floor label" },
    {
      name: "floor_level",
      label: "Floor Level",
      placeholder: "Enter Floor level",
      type: "number",
    },
    {
      name: "design_type",
      label: "Design Type",
      type: "select",
      options: [
        { label: "Iframe", value: "true" },
        { label: "File", value: "false" },
      ],
    },

    ...(url
      ? [
          {
            name: "iframe_url" as const,
            label: "Url",
            type: "text" as const,
          },
        ]
      : [
          {
            name: "file" as const,
            label: "File",
            type: "file" as const,
            accept: "image/*",
          },
        ]),
  ];

  return (
    <Modal
      showHeader={false}
      isOpen={FloorLevelModal}
      onClose={() => dispatch(setFloorLevelModal(false))}
      showCloseButton
      classname="p-0"
    >
      <div className="bg-primary w-full rounded-t-lg px-8 text-white py-3 text-xl font-[600]">
        {"Add Floor Level"}
      </div>
      <div className="overflow-auto">
        <div>
          <CustomForm
            onSubmit={handleSubmit(onSubmit)}
            fields={fields}
            register={register}
            errors={errors}
            isLoading={isPending}
            onClose={() => dispatch(setFloorLevelModal(false))}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddFloorLevelModel;
