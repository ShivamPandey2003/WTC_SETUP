import { useEditExhibitor } from "@/api/exhibitor_design_api/exhibitor_design_api";
import { useGetCategoryAll } from "@/api/programme_design_api/Programme_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setSelected } from "@/redux/ExhibitorSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
    EditExhibitorSchema,
  type ExhibitorSchemaType,
} from "@/Schema/exhibitorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const EditFrom = () => {
  const { selected, Exhibitors } = useSelector(
    (state: RootState) => state.ExhibitorSlice,
  );

  const value = Exhibitors.find((pre) => pre.id === selected);

  const { EditExhibitor, isEditPending } = useEditExhibitor();
  const { AllCategory, isPending } = useGetCategoryAll();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExhibitorSchemaType>({
    resolver: zodResolver(EditExhibitorSchema),
  });

  useEffect(() => {
    if (!value) return;
    reset({ ...value, category: value.categoryId } as any);
  }, [value, reset]);
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (newData: ExhibitorSchemaType) => {
    const formData = new FormData();
    formData.append("full_name", newData.full_name as string);
    formData.append("url", newData.url as string);
    formData.append("email", newData.email as string);
    formData.append("category", newData.category as string);
    formData.append("file", newData.logo?.[0] as Blob);
    formData.append("ads", String(newData?.ads));
    EditExhibitor({ form: formData, id: `${selected}` });
  };

  const onClose = () => dispatch(setSelected(null));

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
    { name: "logo", label: "Logo", type: "file", accept: "image/*" },
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
    { name: "ads", label: "Ads", type: "checkbox" },
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isEditPending}
      onClose={onClose}
    />
  );
};

export default EditFrom;
