import { useCreateSpeaker } from "@/api/speaker_design_api/speaker_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setIsCreating } from "@/redux/SpeakerDesignSlice";
import type { AppDispatch } from "@/redux/store";
import { speakerSchema, type SpeakerForm } from "@/Schema/speakerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const NewFrom = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpeakerForm>({
    resolver: zodResolver(speakerSchema),
  });
  const dispatch = useDispatch<AppDispatch>();
  const { CreateSpeaker, isPending: isCreateSpeakerPending } =
    useCreateSpeaker();

  const onSubmit = (newData: SpeakerForm) => {
    const formData = new FormData();

    formData.append("prefix", newData.prefix as string);
    formData.append("firstname", newData.firstname);
    formData.append("lastname", newData.lastname);
    formData.append("bio", newData.bio as string);
    formData.append("email", newData.email as string);
    formData.append("company", newData.company as string);
    formData.append("designation", newData.designation as string);
    formData.append("external_link", newData?.external_link as string);
    formData.append("profile_image", newData.profile_image?.[0] as Blob);
    formData.append("keyNote", String(newData.keyNote));
    formData.append("linkedin_url", newData.linkedin_url as string);
    formData.append("whatsapp_url", newData.whatsapp_url as string);
    formData.append("attachments", newData.attachments?.[0] as Blob);
    
    CreateSpeaker(formData);
  };

  const onClose = () => dispatch(setIsCreating(false));

  const fields: {
    name: keyof SpeakerForm;
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
    { name: "prefix", label: "Prefix", placeholder: "Enter prefix here" },
    {
      name: "firstname",
      label: "Firstname",
      placeholder: "Enter first name here",
    },
    {
      name: "lastname",
      label: "Lastname",
      placeholder: "Enter last name here",
    },
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      placeholder: "Enter detailed bio...",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter a valid email address",
    },
    { name: "designation", label: "Designation" },
    { name: "company", label: "Company" },
    {
      name: "profile_image",
      label: "Profile Image",
      type: "file",
      accept: "image/png,image/jpg,image/webp",
    },
    {
      name: "attachments",
      label: "Attachments",
      type: "file",
      accept: "application/pdf",
    },
    { name: "external_link", label: "External Link" },
    {
      name: "linkedin_url",
      label: "LinkedIn Link",
      placeholder: "https://www.linkedin.com/in/username",
    },
    {
      name: "whatsapp_url",
      label: "WhatsApp Link",
      placeholder: "https://wa.me/XXXXXXXXXX",
    },
    { name: "keyNote", label: "Keynote", type: "checkbox" },
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isCreateSpeakerPending}
      onClose={onClose}
    />
  );
};

export default NewFrom;
