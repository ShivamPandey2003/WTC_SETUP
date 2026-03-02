import {
  useCreateSession,
  useGetCategoryAll,
} from "@/api/programme_design_api/Programme_design_api";
import { useGetSpeakerList } from "@/api/speaker_design_api/speaker_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setIsCreating } from "@/redux/HomeDesignSlice";
import { setCategoryModal } from "@/redux/ProgrammeDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { SessionSchema, type SessionForm } from "@/Schema/sessionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setIsCreating as CreateSpeaker } from "@/redux/SpeakerDesignSlice";
import { useV2GetFloorMApList } from "@/api/Venue_api/Venue_Design_api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const NewFrom = () => {
  const { AllCategory, isPending } = useGetCategoryAll();
  const { SpeakerList, isPending: isSpeakersListPenindg } = useGetSpeakerList();
  const { V2_FloorMapList, V2_isFloorMapListPending } = useV2GetFloorMApList();
  const [Values, setValues] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const { slectedDate } = useSelector(
    (state: RootState) => state.Programme_Design,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SessionForm>({
    resolver: zodResolver(SessionSchema),
  });
  const dispatch = useDispatch<AppDispatch>();
  const { CreateSession, isPending: isCreateSessionPending } =
    useCreateSession();

  const onClose = () => dispatch(setIsCreating(false));

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
    formData.append("pdf_start_date", formatToYYYYMMDD(newData.pdf_start_date as string));
    formData.append("pdf_end_date", formatToYYYYMMDD(newData.pdf_end_date as string));
    formData.append("location", newData.location);
    formData.append("external_link", newData?.external_link as string);
    formData.append("category", newData.category);
    formData.append("speakers", newData.speakers);
    formData.append("attachment", newData.attachments?.[0] as Blob);
    formData.append("venueID", `${newData.floorID}__${newData.venueID}`);

    CreateSession(formData);
  };

  const selectedFloorID = useWatch({
    control,
    name: "floorID",
  });

  useEffect(() => {
    const Value = V2_FloorMapList?.response
      .find((pre) => pre.id === selectedFloorID)
      ?.map_list.filter((i) => !["IMAGE", "TEXT", "SCRIBBLE"].includes(i.type))
      .map((item) => {
        return {
          label: `${item.name}`,
          value: item.id,
        };
      });

    if (!Value) return;

    setValues(Value);
  }, [selectedFloorID]);

  if (isPending || isSpeakersListPenindg || V2_isFloorMapListPending) {
    return (
      <div className="h-[30vh] flex items-center justify-center">
        <Loader2 size={24} className={`text-primary animate-spin`} />
      </div>
    );
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
      label: "Paper",
      type: "file",
      accept: "application/pdf",
    },
    { name: "pdf_start_date", label: "Paper Start Date", type: "date" },
    { name: "pdf_end_date", label: "Paper End Date", type: "date" },
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
      name: "floorID",
      label: "Floor",
      type: "select",
      placeholder: "Select Floor",
      options: V2_FloorMapList?.response.map((item) => {
        return {
          label: `${item.label}`,
          value: item.id,
        };
      }),
    },
    {
      name: "venueID",
      label: "Venue",
      type: "select",
      placeholder: "Select location",
      options: Values,
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
