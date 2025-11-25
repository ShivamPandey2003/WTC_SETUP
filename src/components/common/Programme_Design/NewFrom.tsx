import {
  useCreateSession,
  useGetCategoryAll,
} from "@/api/programme_design_api/Programme_design_api";
import { useGetSpeakerList } from "@/api/speaker_design_api/speaker_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setIsCreating } from "@/redux/HomeDesignSlice";
import { setSelected } from "@/redux/ProgrammeDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { SessionSchema, type SessionForm } from "@/Schema/sessionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const NewFrom = () => {
  const { AllCategory, isPending } = useGetCategoryAll();
  const { SpeakerList, isPending: isSpeakersListPenindg } = useGetSpeakerList();
  const { selected, session, slectedDate } = useSelector(
    (state: RootState) => state.Programme_Design
  );

  const value = session.find((pre) => pre.session_id === selected);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SessionForm>({
    resolver: zodResolver(SessionSchema),
    defaultValues: selected && value ? value : ({} as any),
  });
  const dispatch = useDispatch<AppDispatch>();
  const { CreateSession, isPending: isCreateSessionPending } =
    useCreateSession();

  console.log(SpeakerList);
  console.log(AllCategory);

  const onClose =
    selected && value
      ? () => dispatch(setSelected(null))
      : () => dispatch(setIsCreating(false));

  const onSubmit = (newData: SessionForm) => {
    const formData = new FormData();

    function formatToYYYYMMDD(date: string | Date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    formData.append("title", newData.title);
    formData.append("description", newData.description);
    formData.append("start_time", newData.start_time);
    formData.append("end_time", newData.end_time);
    formData.append("start_date", formatToYYYYMMDD(slectedDate));
    formData.append("end_date", formatToYYYYMMDD(slectedDate));
    formData.append("location", newData.location);
    formData.append("external_link", newData?.external_link as string);
    formData.append("category", newData.category);
    formData.append("speakers", newData.speakers);
    formData.append("attachments", newData.attachments?.[0] as Blob);

    CreateSession(formData);
  };

  if (isPending || isSpeakersListPenindg) {
    return;
  }

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
      | "time"
      | "array-attachment"
      | "select";
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
    { name: "start_time", label: "Start Time", type: "time" },
    { name: "end_time", label: "End Time", type: "time" },
    {
      name: "attachments",
      label: "Attachments",
      type: "file",
      accept: "image/*",
    },
    { name: "location", label: "Location" },
    { name: "external_link", label: "External Link" },
    {
      name: "category",
      label: "Category",
      type: "select",
      placeholder: "select one value",
      options: AllCategory.response
        .filter((pre: any) => !Boolean(pre.type))
        .map((item: any) => {
          return { label: item.name, value: item.id };
        }),
    },
    {
      name: "speakers",
      label: "Speaker",
      type: "select",
      placeholder: "select one value",
      options: SpeakerList?.response.map((item) => {
        return { label: item.name, value: item.speaker_id };
      }),
    },
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isCreateSessionPending}
      onClose={onClose}
    />
  );
};

export default NewFrom;
