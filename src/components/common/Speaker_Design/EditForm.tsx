import { useEditSpeaker } from "@/api/speaker_design_api/speaker_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setSelected } from "@/redux/SpeakerDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  EditspeakerSchema,
  type EditSpeakerFrom,
} from "@/Schema/speakerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const EditFrom = () => {
  const { selected, speakers } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );

  const value = speakers.find((pre) => pre.speaker_id === selected);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditSpeakerFrom>({
    resolver: zodResolver(EditspeakerSchema),
  });

  useEffect(() => {
    if (!value) return;
    const {
      profile_image,
      attachments,
      whatsapp_url,
      linkedin_url = "",
      ...rest
    } = value;
    reset({
      ...rest,
      profile_image: undefined,
      attachments: undefined,
      whatsapp_url: whatsapp_url ? whatsapp_url : "",
      linkedin_url: linkedin_url ? linkedin_url : "",
    } as any);
  }, [value, reset]);

  const dispatch = useDispatch<AppDispatch>();
  const { EditSpeaker, isPending: isEditSpeakerPending } = useEditSpeaker();

  const onSubmit = (newData: EditSpeakerFrom) => {
    const formData = new FormData();

    formData.append("prefix", newData.prefix as string);
    formData.append("firstname", newData.firstname);
    formData.append("lastname", newData.lastname);
    formData.append("bio", newData.bio as string);
    // formData.append("email", newData.email as string);
    formData.append("company", newData.company as string);
    formData.append("designation", newData.designation as string);
    formData.append("external_link", newData?.external_link as string);
    formData.append("keyNote", String(newData.keyNote));
    formData.append("show_mail", String(newData.show_mail));
    formData.append("linkedin_url", newData.linkedin_url as string);
    formData.append("whatsapp_url", newData.whatsapp_url as string);
    if (newData.attachments?.[0]) {
      formData.append("attachments", newData.attachments?.[0] as Blob);
    }
    if (newData.profile_image?.[0]) {
      formData.append("profile_image", newData.profile_image?.[0] as Blob);
    }

    formData.append("id", selected as string);
    EditSpeaker(formData);
  };

  const onClose = () => dispatch(setSelected(null));

  const fields: {
    name: keyof EditSpeakerFrom;
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
    // {
    //   name: "email",
    //   label: "Email",
    //   placeholder: "Enter a valid email address",
    // },
    { name: "designation", label: "Designation" },
    { name: "company", label: "Company" },
    {
      name: "profile_image",
      label: "Profile Image",
      type: "file",
      accept: "image/png,image/jpg,image/webp,image/jpeg",
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
    { name: "show_mail", label: "Show mail", type: "checkbox"},
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isEditSpeakerPending}
      onClose={onClose}
    />
  );
};

export default EditFrom;
