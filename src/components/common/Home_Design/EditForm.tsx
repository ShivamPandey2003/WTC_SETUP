import { EditSchema } from "@/Schema/newSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomForm from "@/components/global/CustomForm";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { useEditNews } from "@/api/home_design_api/Home_design_api";
import { setSelected } from "@/redux/HomeDesignSlice";
import { useEffect } from "react";

export const FormSchema = EditSchema.omit({
  "Created On": true,
  is_active: true,
  is_published: true,
  id: true,
  created_by: true,
  tile_space: true,
});

type FormData = z.infer<typeof FormSchema>;

const EditFrom = () => {
  const { selected, news } = useSelector(
    (state: RootState) => state.Home_Design,
  );
  const data = news.find((item) => item.id === selected);
  const { EditNews, isPending } = useEditNews();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: selected && data ? data : {},
  });

  useEffect(() => {
    if (!data) return;
    reset({
      title: data.title,
      description: data.description,
    });
  }, [data, reset, setValue]);

  const onSubmit = (newData: FormData) => {
    const formData = new FormData();

    formData.append("title", newData.title);
    formData.append("description", newData.description as string);
    formData.append("tile_space", "1x");
    if (newData.attachments?.[0]) {
      formData.append("attachment", newData.attachments?.[0] as Blob);
    }

    formData.append("id", selected as string);
    EditNews(formData);
  };

  const onClose = () => dispatch(setSelected(null));

  const fields: {
    name: keyof FormData;
    label: string;
    type?: "text" | "textarea" | "file" | "select";
    placeholder?: string;
    accept?: string;
    options?: { label: string; value: string }[];
  }[] = [
    { name: "title", label: "Title", placeholder: "Enter title here" },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter detailed description...",
    },
    {
      name: "attachments",
      label: "Attachments",
      type: "file",
      accept: "image/png,image/jpg,image/webp",
    },
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isPending}
      onClose={() => onClose()}
    />
  );
};

export default EditFrom;
