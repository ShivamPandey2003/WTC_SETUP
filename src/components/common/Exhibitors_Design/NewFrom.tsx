import {
  useCreateExhibitor,
  useEditExhibitor,
} from "@/api/exhibitor_design_api/exhibitor_design_api";
import { useGetCategoryAll } from "@/api/programme_design_api/Programme_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setSelected, setIsCreating } from "@/redux/ExhibitorSlice";
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
    (state: RootState) => state.ExhibitorSlice,
  );

  const value = Exhibitors.find((pre) => pre.id === selected);

  const { CreateExhibitor, isCreatePending } = useCreateExhibitor();
  const { EditExhibitor, isEditPending } = useEditExhibitor();
  const { AllCategory, isPending } = useGetCategoryAll();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExhibitorSchemaType>({
    resolver: zodResolver(ExhibitorSchema),
    defaultValues:
      selected && value
        ? { ...value, category: value.categoryId }
        : ({} as any),
  });
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (newData: ExhibitorSchemaType) => {
    if (selected && value) {
      const formData = new FormData();
      formData.append("full_name", newData.full_name as string);
      formData.append("url", newData.url as string);
      formData.append("email", newData.email as string);
      formData.append("category", newData.category as string);
      formData.append("logo", newData.logo?.[0] as Blob);
      formData.append("ads", String(newData?.ads));
      EditExhibitor({ form:formData, id: `${selected}` });
    } else {
      const formData = new FormData();
      formData.append("full_name", newData.full_name as string);
      formData.append("url", newData.url as string);
      formData.append("email", newData.email as string);
      formData.append("category", newData.category as string);
      formData.append("logo", newData.logo?.[0] as Blob);
      formData.append("ads", String(newData?.ads));
      CreateExhibitor(formData);
    }
  };

  const onClose =
    selected && value
      ? () => dispatch(setSelected(null))
      : () => dispatch(setIsCreating(false));

  if (isPending) {
    return;
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
      isLoading={isCreatePending || isEditPending}
      onClose={onClose}
    />
  );
};

export default NewFrom;
