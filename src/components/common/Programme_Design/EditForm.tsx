import {
  useEditSession,
  useGetCategoryAll,
} from "@/api/programme_design_api/Programme_design_api";
import { useGetSpeakerList } from "@/api/speaker_design_api/speaker_design_api";
import CustomForm from "@/components/global/CustomForm";
import { setCategoryModal, setSelected } from "@/redux/ProgrammeDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { EditSessionSchema, type EditSessionForm, type SessionForm } from "@/Schema/sessionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setIsCreating as CreateSpeaker } from "@/redux/SpeakerDesignSlice";
import { useV2GetFloorMApList } from "@/api/Venue_api/Venue_Design_api";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useEffect, useState } from "react";

const EditFrom = () => {
  const { AllCategory, isPending } = useGetCategoryAll();
  const { SpeakerList, isPending: isSpeakersListPenindg } = useGetSpeakerList();
  const { V2_FloorMapList, V2_isFloorMapListPending } = useV2GetFloorMApList();
  const [Values, setValues] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const { selected, session, slectedDate } = useSelector(
    (state: RootState) => state.Programme_Design,
  );

  const value = session.find((pre) => pre.session_id === selected);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof EditSessionSchema>>({
    resolver: zodResolver(EditSessionSchema),
  });

  useEffect(() => {
    if (!value) return;
    const {attachments, ...rest} = value
    reset({
      ...rest,
      speakers: value.speakers[0],
      venueID: value?.venue?.id ? value.venue.id.split("__")[1] : "",
      floorID: value?.venue?.id ? value?.venue?.id.split("__")[0] : "",
      category: value.category[0],
    });
  }, [value, reset]);

  const dispatch = useDispatch<AppDispatch>();

  const { EditSession, isPending: isEditSessionPending } = useEditSession();

  const onClose = () => dispatch(setSelected(null));

  const onSubmit = (newData: EditSessionForm) => {
    const formData = new FormData();

    function formatToYYYYMMDD(date: string | Date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    formData.append("title", newData.title);
    formData.append("description", newData?.description as string);
    formData.append("start_time", newData.start_time);
    formData.append("end_time", newData.end_time);
    formData.append("start_date", formatToYYYYMMDD(slectedDate));
    formData.append("end_date", formatToYYYYMMDD(slectedDate));
    formData.append("location", newData.location);
    formData.append("external_link", newData?.external_link as string);
    formData.append("category", newData.category);
    if(newData.speakers){
      formData.append("speakers", newData.speakers);
    }
    if(newData.bg_image?.[0]){
      formData.append("bg_image", newData.bg_image[0] as Blob);
    }
    if (newData.attachments && newData.attachments?.length > 0) {
      Array.from(newData.attachments).forEach((file) => {
        formData.append("attachment", file);
      });
    }
    if (newData.floorID) {
      formData.append("venueID", `${newData.floorID}__${newData.venueID}`);
    }

    formData.append("id", selected as string);
    EditSession(formData);
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
      type: "array-attachment",
      accept: "application/pdf",
    },
    {
      name: "bg_image",
      label: "Image",
      type: "file",
      accept: "image/png,image/jpg,image/webp,image/jpeg",
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
          label: item.name,
          value: item.id,
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
      isLoading={isEditSessionPending}
      onClose={onClose}
      setValue={setValue}
    />
  );
};

export default EditFrom;
