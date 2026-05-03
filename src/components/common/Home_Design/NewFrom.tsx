import { useState } from "react";
import { newsSchema } from "@/Schema/newSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomForm from "@/components/global/CustomForm";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { useCreateNews } from "@/api/home_design_api/Home_design_api";
import { setIsCreating } from "@/redux/HomeDesignSlice";
import { apiRequest } from "@/services/apiService";
import axios from "axios";
import { toast } from "sonner";

export const FormSchema = newsSchema.omit({
  "Created On": true,
  is_active: true,
  is_published: true,
  id: true,
  created_by: true,
  tile_space: true,
});

type FormData = z.infer<typeof FormSchema>;

const NewFrom = () => {
  const { CreateNews, isPending: isCreatePending } = useCreateNews();
  const dispatch = useDispatch<AppDispatch>();
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const handleFileChange = async (file: File) => {
    setIsFileUploading(true);
    try {
      const tempId = crypto.randomUUID();
      const res = await apiRequest(
        "post",
        `/upload/presigned-url?file_name=${file.name}&module=news&ref_id=${tempId}`,
      );
      if (!res?.response?.response) return;
      const { file_key, upload_url } = res.response.response;
      await axios.put(upload_url, file, {
        headers: { "Content-Type": file.type },
        responseType: "blob",
      });
      setFileKey(file_key);
      setUploadedFile(file);
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
    if (fileKey) {
      formData.append("file_key", fileKey);
    }
    CreateNews(formData);
  };

  const onClose = () => dispatch(setIsCreating(false));

  const fields: {
    name: keyof FormData;
    label: string;
    type?: "text" | "textarea" | "file" | "select";
    placeholder?: string;
    accept?: string;
    options?: { label: string; value: string }[];
    onFileChange?: (file: File) => Promise<void>;
    isFileUploading?: boolean;
    uploadedFile?: File | null;
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
      uploadedFile,
    },
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isCreatePending || isFileUploading}
      onClose={() => onClose()}
    />
  );
};

export default NewFrom;
