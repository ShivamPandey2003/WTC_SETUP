import { useEditExhibitor } from "@/api/exhibitor_design_api/exhibitor_design_api";
import { useGetCategoryAll } from "@/api/programme_design_api/Programme_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setSelected } from "@/redux/ExhibitorSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  EditExhibitorSchema,
  type EditExhibitorSchemaType,
  type ExhibitorSchemaType,
} from "@/Schema/exhibitorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
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
    control
  } = useForm<EditExhibitorSchemaType>({
    resolver: zodResolver(EditExhibitorSchema),
  });

  useEffect(() => {
    if (!value) return;
    const { logo, url, ...rest } = value;
    reset({
      ...rest,
      logo: undefined,
      category: value.categoryId,
      url: url ? url : "",
    } as any);
  }, [value, reset]);
  const dispatch = useDispatch<AppDispatch>();

  const categoryType = useWatch({
      control,
      name: "category",
    });
  
    const IsShow = useMemo(() => {
      if (!AllCategory?.response.length) return false;
  
      const present = AllCategory.response.find((pre) => pre.id === categoryType);
  
      if (!present) return false;
  
      return present.allow_image;
    }, [categoryType]);

  const onSubmit = (newData: EditExhibitorSchemaType) => {
    const formData = new FormData();
    formData.append("full_name", newData.full_name as string);
    if (newData.url) {
      formData.append("url", newData.url as string);
    }
    formData.append("email", newData.email as string);
    formData.append("category", newData.category as string);
    formData.append("ads", String(newData?.ads));
    formData.append("show_mail", String(newData?.show_mail));
    if (newData.booth_no) {
      formData.append("booth_no", newData.booth_no as string);
    }
    if (newData.logo?.[0]) {
      formData.append("logo", newData.logo?.[0] as Blob);
    }
    if(newData.image?.[0] && IsShow){
      formData.append("image", newData.image?.[0] as Blob);
    }
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
    {
      name: "logo",
      label: "Logo",
      type: "file",
      accept: "image/png,image/jpg,image/webp,image/jpeg",
    },
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
     ...(IsShow
      ? [
          {
            name: "image",
            label: "Image",
            type: "file",
            accept: "image/png,image/jpg,image/webp,image/jpeg",
          } as const,
        ]
      : []),
    {
      name: "booth_no",
      label: "Booth Location",
      placeholder: "Enter booth location here",
    },
    { name: "ads", label: "Ads", type: "checkbox" },
    { name: "show_mail", label: "Show mail", type: "checkbox" },
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
