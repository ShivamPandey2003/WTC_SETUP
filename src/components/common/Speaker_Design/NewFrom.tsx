import { useCreateSpeaker, useEditSpeaker } from "@/api/speaker_design_api/speaker_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setIsCreating, setSelected } from "@/redux/SpeakerDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { speakerSchema, type SpeakerForm } from "@/Schema/speakerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const NewFrom = () => {
  const { selected, speakers } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice
  );

  const value = speakers.find((pre) => pre.speaker_id === selected);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpeakerForm>({
    resolver: zodResolver(speakerSchema),
    defaultValues: selected && value ? value : ({} as any),
  });
  const dispatch = useDispatch<AppDispatch>();
  const {CreateSpeaker, isPending:isCreateSpeakerPending} = useCreateSpeaker()
  const {EditSpeaker, isPending:isEditSpeakerPending} = useEditSpeaker()

  const onSubmit = (newData: SpeakerForm) => {
    const formData = new FormData();

    formData.append("fullname", newData.name);
    formData.append("bio", newData.bio as string);
    formData.append("company", newData.company as string);
    formData.append("designation", newData.designation as string);
    formData.append("external_link", newData?.external_link as string);
    formData.append("attachments", newData.attachments?.[0] as Blob);

    if(selected && value){
      formData.append("id", selected)
      EditSpeaker(formData)
    }else{
      CreateSpeaker(formData);
    }
  };

  const onClose =
    selected && value
      ? () => dispatch(setSelected(null))
      : () => dispatch(setIsCreating(false));

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
    { name: "name", label: "name", placeholder: "Enter name here" },
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      placeholder: "Enter detailed bio...",
    },
    { name: "designation", label: "Designation" },
    { name: "company", label: "Company" },
    {
      name: "attachments",
      label: "Attachments",
      type: "file",
      accept: "image/*",
    },
    { name: "external_link", label: "External Link" },
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isCreateSpeakerPending || isEditSpeakerPending}
      onClose={onClose}
    />
  );
};

export default NewFrom;
