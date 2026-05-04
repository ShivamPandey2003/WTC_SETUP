import { useState, useEffect } from "react";
import { EditSchema } from "@/Schema/newSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomForm from "@/components/global/CustomForm";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { useEditNews } from "@/api/home_design_api/Home_design_api";
import { setSelected } from "@/redux/HomeDesignSlice";
import { apiRequest } from "@/services/apiService";
import axios from "axios";
import { toast } from "sonner";

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
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);

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

  const handleFileChange = async (file: File) => {
    setIsFileUploading(true);
    try {
      const res = await apiRequest(
        "post",
        `/upload/presigned-url?file_name=${file.name}&module=news&ref_id=${selected}`,
      );
      if (!res?.response?.response) return;
      const { file_key, upload_url } = res.response.response;
      await axios.put(upload_url, file, {
        headers: { "Content-Type": file.type },
        responseType: "blob",
      });
      setFileKey(file_key);
    } catch (error) {
      toast.error("Image upload failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsFileUploading(false);
    }
  };

  const onSubmit = (newData: FormData) => {
    const formData = new FormData();
    formData.append("title", newData.title);
    formData.append("description", newData.description as string);
    formData.append("tile_space", "1x");
    formData.append("id", selected as string);
    if (fileKey) {
      formData.append("file_key", fileKey);
    }
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
    onFileChange?: (file: File) => Promise<void>;
    isFileUploading?: boolean;
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
      label: "Image",
      type: "file",
      accept: "image/png,image/jpg,image/webp,image/jpeg",
      onFileChange: handleFileChange,
      isFileUploading,
    },
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isPending || isFileUploading}
      onClose={() => onClose()}
    />
  );
};

export default EditFrom;
