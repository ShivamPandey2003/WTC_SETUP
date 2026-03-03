import { useEditFloorLevel } from "@/api/Venue_api/Venue_Design_api";
import CustomForm from "@/components/global/CustomForm";
import Modal from "@/components/ui/Modal";
import type { AppDispatch, RootState } from "@/redux/store";
import { setEditFloorLevelModal } from "@/redux/venueDesignV2Slice";
import {
  EditFloorLevelSchema,
  type FloorLevelSchemaType,
} from "@/Schema/FloorLevelSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

type EditFloorLevelModelProp = {
  id: string;
};

const EditFloorLevelModel = ({ id }: EditFloorLevelModelProp) => {
  const { EditFloorLevelModal, map } = useSelector(
    (state: RootState) => state.Venue_Design_V2,
  );
  const Value = map.find((pre) => pre.id === id);
  const { EditFloorLevel, isPending } = useEditFloorLevel();
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(EditFloorLevelSchema),
  });
  const [url, setUrl] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const designType = useWatch({
    control,
    name: "design_type",
  });

  useEffect(() => {
    if (!Value) return;
    reset({
      label: Value.label,
      floor_level: Value.floor_level,
      design_type: Value.design_type,
      iframe_url: Value.iframe_url
    });
  }, [Value, reset, setValue]);

  useEffect(() => {
    const value = String(designType) === "true";
    setUrl(value);
  }, [designType]);

  const onSubmit = (newData: FloorLevelSchemaType) => {
    const formData = new FormData();
    formData.append("label", newData.label);
    formData.append("floor_level", String(newData.floor_level));
    formData.append("file", newData.file?.[0] as Blob);

    EditFloorLevel({ id: id, data: formData });

    reset();
  };

  const fields: {
    name: keyof FloorLevelSchemaType;
    label: string;
    type?:
      | "text"
      | "textarea"
      | "number"
      | "file"
      | "file-new"
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
      isOpen={EditFloorLevelModal}
      onClose={() => dispatch(setEditFloorLevelModal(false))}
      showCloseButton
      classname="p-0"
    >
      <div className="bg-primary w-full rounded-t-lg px-8 text-white py-3 text-xl font-[600]">
        {"Edit Floor Plan"}
      </div>
      <div className="overflow-auto">
        <div>
          <CustomForm
            onSubmit={handleSubmit(onSubmit)}
            fields={fields}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            isLoading={isPending}
            onClose={() => dispatch(setEditFloorLevelModal(false))}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditFloorLevelModel;
