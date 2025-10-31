import { newsSchema } from "@/Schema/newSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomForm from "@/components/global/CustomForm";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import News from "@/data/News";

export const FormSchema = newsSchema.omit({
  "Created On": true,
  is_active: true,
  is_published: true,
  id: true,
  created_by: true,
});

type FormData = z.infer<typeof FormSchema>;

const NewFrom = () => {

  const {selected} = useSelector((state:RootState)=>state.Home_Design)

  const data = News.find(item=>item.id === selected)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: selected ? data: {}
  });

  const onSubmit = (data: FormData) => {
    console.log("✅ Form data:", data);
  };

  const fields: {
    name: keyof FormData;
    label: string;
    type?: "text" | "textarea" | "file";
  }[] = [
    { name: "title", label: "Title" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "tile_space", label: "Tile Space" },
  ];

  return (
    <CustomForm
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      register={register}
      errors={errors}
    />
  );
};

export default NewFrom;
