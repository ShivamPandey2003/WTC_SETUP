import { newsSchema } from "@/Schema/newSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomForm from "@/components/global/CustomForm";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  useCreateNews,
  useEditNews,
} from "@/api/home_design_api/Home_design_api";
import { setIsCreating, setSelected } from "@/redux/HomeDesignSlice";

export const FormSchema = newsSchema.omit({
  "Created On": true,
  is_active: true,
  is_published: true,
  id: true,
  created_by: true,
});

type FormData = z.infer<typeof FormSchema>;

const NewFrom = () => {
  const { selected, news } = useSelector(
    (state: RootState) => state.Home_Design
  );
  const data = news.find((item) => item.id === selected);
  const { EditNews, isPending } = useEditNews();
  const { CreateNews, isPending: isCreatePending } = useCreateNews();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: selected && data ? data : {},
  });

  const onSubmit = (newData: FormData) => {
     const formData = new FormData();

     formData.append("title", newData.title)
     formData.append("description", newData.description as string)
     formData.append("tile_space", newData.tile_space as string)

    if (selected && data) {
      formData.append("id", selected)
      EditNews(formData);
    } else {
      CreateNews(formData);
    }
  };

  const onClose =
    selected && data
      ? () => dispatch(setSelected(null))
      : () => dispatch(setIsCreating(false));

  const fields: {
    name: keyof FormData;
    label: string;
    type?: "text" | "textarea" | "file"| "select";
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
    { name: "tile_space", label: "Tile Space", placeholder: "example:- 2x", type: "select", options:[{label:"1x", value:"1x"},{label:"2x", value:"2x"}] },
    {
      name: "attachments",
      label: "Attachments",
      type: "file",
      accept: "image/*",
    }
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
      isLoading={isPending || isCreatePending}
      onClose={() => onClose()}
    />
  );
};

export default NewFrom;
