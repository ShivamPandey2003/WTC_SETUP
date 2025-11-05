import { useCreateSession } from "@/api/programme_design_api/Programme_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setIsCreating } from "@/redux/HomeDesignSlice";
import type { AppDispatch } from "@/redux/store";
import { SessionSchema, type SessionForm } from "@/Schema/sessionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const NewFrom = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SessionForm>({resolver:zodResolver(SessionSchema)});
  const dispatch = useDispatch<AppDispatch>();
  const { CreateSession, isPending: isCreateSessionPending } =
    useCreateSession();

  const onSubmit = (newData: SessionForm) => {
    const formData = new FormData();

    formData.append("title", newData.title);
    formData.append("description", newData.description);
    formData.append("start_time", newData.start_time);
    formData.append("end_time", newData.end_time);
    formData.append("location", newData.location);
    formData.append("external_link", newData?.external_link as string);
    formData.append("category", newData.category);
    formData.append("speakers", newData.speakers);
    formData.append("attachments", newData.attachments?.[0] as Blob);

    CreateSession(formData);
  };

  const fields: {
    name: keyof SessionForm;
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
    accept?:string
  }[] = [
    { name: "title", label: "Title", placeholder: "Enter title here" },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter detailed description...",
    },
    { name: "start_time", label: "Start Time", type: "date" },
    { name: "end_time", label: "End Time", type: "date" },
    { name: "attachments", label: "Attachments", type: "file", accept: "image/*" },
    { name: "location", label: "Location" },
    { name: "external_link", label: "External Link" },
    { name: "category", label: "Category" },
    { name: "speakers", label: "Speaker" },
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isCreateSessionPending}
      onClose={() => dispatch(setIsCreating(false))}
    />
  );
};

export default NewFrom;
