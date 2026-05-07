import { useAddCategory } from "@/api/programme_design_api/Programme_design_api";
import CustomForm from "@/components/global/CustomForm";
import Modal from "@/components/ui/Modal";
import { setCategoryModal } from "@/redux/ExhibitorSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1).min(3, "minimum 3 word required"), 
  color: z.string().min(1),
  allow_image: z.boolean(),
});


export type Category = z.infer<typeof CategorySchema>;

const AddCategoryModel = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue
  } = useForm<Category>({ resolver: zodResolver(CategorySchema) });
  const {AddCategory, isAddCategoryPending} = useAddCategory()
  const dispatch = useDispatch<AppDispatch>();
  const {categoryModal} = useSelector((state:RootState)=>state.ExhibitorSlice)

  const onSubmit = (newData: Category)=>{
    const newDataFormatted = {
      ...newData,
      category_type: 1
    }
    AddCategory(newDataFormatted)
    reset();
  }

  const fields: {
    name: keyof Category;
    label: string;
    type?:
      | "text"
      | "textarea"
      | "number"
      | "file"
      | "checkbox"
      | "date"
      | "array-string"
      | "color"
      | "array-attachment";
    placeholder?: string;
  }[] = [
    { name: "name", label: "Name", placeholder: "Enter category name" },
    { name: "color", label: "Color", placeholder: "ex: #ffffff", type:'color' },
    { name: "allow_image", label: "Carousel Media", type: "checkbox" }
  ];

  return (
    <Modal
      showHeader={false}
      isOpen={categoryModal}
      onClose={() => dispatch(setCategoryModal(false))}
      showCloseButton
      classname="p-0"
    >
      <div className="bg-primary w-full rounded-t-lg px-8 text-white py-3 text-xl font-[600]">
        {"Add Category"}
      </div>
      <div>
        <div>
          <CustomForm
            onSubmit={handleSubmit(onSubmit)}
            fields={fields}
            register={register}
            errors={errors}
            isLoading={isAddCategoryPending}
            onClose={() => dispatch(setCategoryModal(false))}
            control={control}
            setValue={setValue}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddCategoryModel;
