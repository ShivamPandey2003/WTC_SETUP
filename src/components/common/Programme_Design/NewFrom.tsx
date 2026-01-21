import {
  useCreateSession,
  useEditSession,
  useGetCategoryAll,
} from "@/api/programme_design_api/Programme_design_api";
import { useGetSpeakerList } from "@/api/speaker_design_api/speaker_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setIsCreating } from "@/redux/HomeDesignSlice";
import { setCategoryModal, setSelected } from "@/redux/ProgrammeDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { SessionSchema, type SessionForm } from "@/Schema/sessionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setIsCreating as CreateSpeaker } from "@/redux/SpeakerDesignSlice";
import { useGetAdminFloorPlanV2 } from "@/api/Venue_api/Venue_Design_api";

const NewFrom = () => {
  const { AllCategory, isPending } = useGetCategoryAll();
  const { SpeakerList, isPending: isSpeakersListPenindg } = useGetSpeakerList();
  const { FloorPlan, isPending: isFloorPlanPending } = useGetAdminFloorPlanV2();
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
    defaultValues:
      selected && value
        ? {
            ...value,
            speakers: value.speakers[0],
            venueID: value?.venue?.id ?? "",
            category: value.category[0],
          }
        : ({} as any),
  });
  const dispatch = useDispatch<AppDispatch>();
  const { CreateSession, isPending: isCreateSessionPending } =
    useCreateSession();

  const { EditSession, isPending: isEditSessionPending } = useEditSession();

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
    formData.append("venueID", newData.venueID);

    if (value) {
      formData.append("id", selected as string);
      EditSession(formData);
    } else {
      CreateSession(formData);
    }
  };

  if (isPending || isSpeakersListPenindg || isFloorPlanPending) {
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
    addMoreHandler?: () => void;
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
      placeholder: "Select a category",
      options: AllCategory?.response
        .filter((pre) => !Boolean(pre.type))
        .map((item) => {
          return { label: item.name, value: item.id };
        }),
      addMoreHandler: () => dispatch(setCategoryModal(true)),
    },
    {
      name: "speakers",
      label: "Speaker",
      type: "select",
      placeholder: "Select a speaker",
      options: SpeakerList?.response.map((item) => {
        return {
          label: `${item.prefix} ${item.firstname} ${item.lastname}`,
          value: item.speaker_id,
        };
      }),
      addMoreHandler: () => dispatch(CreateSpeaker(true)),
    },
    {
      name: "venueID",
      label: "Venue",
      type: "select",
      placeholder: "Select location",
      options: FloorPlan?.response.floor_map_list
        .filter((i) => !["IMAGE", "TEXT", "SCRIBBLE"].includes(i.type))
        .map((item) => {
          return {
            label: `${item.name}`,
            value: item.id,
          };
        }),
    },
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isCreateSessionPending || isEditSessionPending}
      onClose={onClose}
    />
  );
};

export default NewFrom;
