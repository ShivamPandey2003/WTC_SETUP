import { useCreateFloorLevel } from "@/api/Venue_api/Venue_Design_api";
import CustomForm from "@/components/global/CustomForm";
import Modal from "@/components/ui/Modal";
import type { AppDispatch, RootState } from "@/redux/store";
import { setFloorLevelModal } from "@/redux/venueDesignV2Slice";
import { FloorLevelSchema, type FloorLevelSchemaType } from "@/Schema/FloorLevelSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const AddFloorLevelModel = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FloorLevelSchemaType>({ resolver: zodResolver(FloorLevelSchema) });
  const dispatch = useDispatch<AppDispatch>();
  const {FloorLevelModal} = useSelector((state:RootState)=>state.Venue_Design_V2)
  const {CreateFloorLevel, isPending} = useCreateFloorLevel()

  const onSubmit = (newData: FloorLevelSchemaType)=>{
    const formData = new FormData();
    formData.append("label", newData.label)
    formData.append("floor_level", String(newData.floor_level))
    formData.append("file", newData.file?.[0] as Blob)

    CreateFloorLevel(formData)
    reset();
  }

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
      | "array-attachment";
    placeholder?: string;
    accept?: string;
  }[] = [
    { name: "label", label: "Label", placeholder: "Enter Floor label" },
    { name: "floor_level", label: "Floor Level", placeholder: "Enter Floor level", type:"number" },
    {
      name: "file",
      label: "File",
      type: "file",
      accept: "image/*",
    }
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
      <div className="p-6 overflow-auto">
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
