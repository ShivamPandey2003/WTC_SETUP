import { useEditFloorLevel } from "@/api/Venue_api/Venue_Design_api";
import CustomForm from "@/components/global/CustomForm";
import Modal from "@/components/ui/Modal";
import type { AppDispatch, RootState } from "@/redux/store";
import { setEditFloorLevelModal } from "@/redux/venueDesignV2Slice";
import {
  EditFloorLevelSchema,
  type FloorLevelSchemaType,
} from "@/Schema/FloorLevelSchema";
import { apiRequest } from "@/services/apiService";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type EditFloorLevelModelProp = {
  id: string;
};

const EditFloorLevelModel = ({ id }: EditFloorLevelModelProp) => {
  const { EditFloorLevelModal, map } = useSelector(
    (state: RootState) => state.Venue_Design_V2,
  );
  const Value = map.find((pre) => pre.id === id);
  const { EditFloorLevel, isPending } = useEditFloorLevel();
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
      iframe_url: Value.iframe_url,
    });
  }, [Value, reset, setValue]);

  useEffect(() => {
    const value = String(designType) === "true";
    setUrl(value);
  }, [designType]);

  const onSubmit = async (newData: FloorLevelSchemaType) => {
    const formData = new FormData();
    formData.append("label", newData.label);
    formData.append("floor_level", String(newData.floor_level));
    if (newData.iframe_url) {
      formData.append("iframe_url", newData.iframe_url);
    }

    if (newData.file?.[0]) {
      const file = newData.file?.[0];
      try {
        setIsLoading(true)
        const res = await apiRequest(
          "post",
          `/upload/presigned-url?file_name=${file.name}&module=${"floor_plan_design"}&ref_id=${id}`,
        );

        const { file_key, upload_url } = res.response.response;
        await axios.put(upload_url, file, {
          headers: {
            "Content-Type": file.type,
          },
          responseType: "blob",
        });

        const newForm = new FormData();
        newForm.append("module", "designer");
        newForm.append("record_id", id);
        newForm.append("file_path_image", file_key);

        await apiRequest("post", "upload/common/files", newForm);

        formData.append("file_path", file_key);
      } catch (error:any) {
        toast.error("Image is not uploaded", error.message)
      }finally{
        setIsLoading(false)
      }
    }

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
            accept: "image/png,image/jpg,image/webp",
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
            isLoading={isPending || isLoading}
            onClose={() => dispatch(setEditFloorLevelModal(false))}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditFloorLevelModel;
