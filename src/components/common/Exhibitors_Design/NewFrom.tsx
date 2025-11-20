import { useCreateExhibitor, useEditExhibitor } from "@/api/exhibitor_design_api/exhibitor_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setSelected } from "@/redux/ExhibitorSlice";
import { setIsCreating } from "@/redux/HomeDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  ExhibitorSchema,
  type ExhibitorSchemaType,
} from "@/Schema/exhibitorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const NewFrom = () => {
  const { selected, Exhibitors } = useSelector(
    (state: RootState) => state.ExhibitorSlice
  );

  const value = Exhibitors.find((pre) => pre.id === selected);

  const { CreateExhibitor, isCreatePending } = useCreateExhibitor();
  const {EditExhibitor, isEditPending} = useEditExhibitor();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExhibitorSchemaType>({
    resolver: zodResolver(ExhibitorSchema),
    defaultValues: selected && value ? value : ({} as any),
  });
  const dispatch = useDispatch<AppDispatch>();


  const onSubmit = (newData: ExhibitorSchemaType) => {
     if (selected && value) {
      EditExhibitor({...newData, id:`${selected}`});
     }
     else{
       CreateExhibitor(newData);
     }
  };

  const onClose =
    selected && value
      ? () => dispatch(setSelected(null))
      : () => dispatch(setIsCreating(false));

  const fields: {
    name: keyof ExhibitorSchemaType;
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
    { name: "full_name", label: "Name", placeholder: "Enter name here" },
    {
      name: "url",
      label: "Url",
      placeholder: "https://example.com",
    },
    { name: "email", label: "Email", placeholder: "example@mail.com" },
    { name: "logo", label: "Logo" },
    { name: "category", label: "Category", placeholder: "Enter category here" },
    { name: "ads", label: "Ads", type: "checkbox" },
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isCreatePending || isEditPending}
      onClose={onClose}
    />
  );
};

export default NewFrom;
