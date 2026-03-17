import { useAddCategory } from "@/api/programme_design_api/Programme_design_api";
import CustomForm from "@/components/global/CustomForm";
import Modal from "@/components/ui/Modal";
import { setCategoryModal } from "@/redux/ProgrammeDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().nonempty().min(3, "minimum 3 word required"),
  color: z.string().nonempty(),
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
  const {categoryModal} = useSelector((state:RootState)=>state.Programme_Design)

  const onSubmit = (newData: Category)=>{
    const newDataFormatted = {
      ...newData,
      category_type: 0
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
      | "color"
      | "array-string"
      | "array-attachment";
    placeholder?: string;
  }[] = [
    { name: "name", label: "Name", placeholder: "Enter category name" },
    { name: "color", label: "Color", placeholder: "ex: #ffffff", type:"color" },
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
            setValue={setValue}
            control={control}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddCategoryModel;
