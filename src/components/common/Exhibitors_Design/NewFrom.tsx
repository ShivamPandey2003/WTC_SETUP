import { useCreateExhibitor } from "@/api/exhibitor_design_api/exhibitor_design_api";
import { useGetCategoryAll } from "@/api/programme_design_api/Programme_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setIsCreating } from "@/redux/ExhibitorSlice";
import type { AppDispatch } from "@/redux/store";
import {
  ExhibitorSchema,
  type ExhibitorSchemaType,
} from "@/Schema/exhibitorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const NewFrom = () => {
  const { CreateExhibitor, isCreatePending } = useCreateExhibitor();
  const { AllCategory, isPending } = useGetCategoryAll();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExhibitorSchemaType>({
    resolver: zodResolver(ExhibitorSchema),
  });
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (newData: ExhibitorSchemaType) => {
    const formData = new FormData();
    formData.append("full_name", newData.full_name as string);
    formData.append("url", newData.url as string);
    formData.append("email", newData.email as string);
    formData.append("category", newData.category as string);
    formData.append("logo", newData.logo?.[0] as Blob);
    formData.append("ads", String(newData?.ads));
    formData.append("show_mail", String(newData?.show_mail));
    formData.append("booth_no", newData?.booth_no as string);
    CreateExhibitor(formData);
  };

  const onClose = () => dispatch(setIsCreating(false));

  if (isPending) {
    return (
      <div className="h-[30vh] flex items-center justify-center">
        <Loader2 size={24} className={`text-primary animate-spin`} />
      </div>
    );
  }

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
      | "select"
      | "array-attachment";
    placeholder?: string;
    accept?: string;
    options?: { label: string; value: string }[];
  }[] = [
    { name: "full_name", label: "Name", placeholder: "Enter name here" },
    {
      name: "url",
      label: "Url",
      placeholder: "https://example.com",
    },
    { name: "email", label: "Email", placeholder: "example@mail.com" },
    { name: "logo", label: "Logo", type: "file", accept: "image/png,image/jpg,image/webp,image/jpeg" },
    {
      name: "category",
      label: "Category",
      placeholder: "Enter category here",
      type: "select",
      options: AllCategory?.response
        .filter((pre: any) => Boolean(pre.type))
        .map((item: any) => {
          return { label: item.name, value: item.id };
        }),
    },
    { name: "booth_no", label: "Booth Location", placeholder: "Enter booth location here" },
    { name: "ads", label: "Ads", type: "checkbox" },
    { name: "show_mail", label: "Show mail", type: "checkbox"},
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isCreatePending}
      onClose={onClose}
    />
  );
};

export default NewFrom;
