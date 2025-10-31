import React from "react";
import {
  type FieldErrors,
  type UseFormRegister,
  type Path,
} from "react-hook-form";
import { Button } from "../ui/Button";
import { Save } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setSelected } from "@/redux/HomeDesignSlice";

type FieldConfig<T extends Record<string, any>> = {
  name: Path<T>;
  label: string;
  type?: "text" | "textarea" | "number" | "file" | "checkbox";
};

type Props<T extends Record<string, any>> = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  fields: FieldConfig<T>[];
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

const CustomForm = <T extends Record<string, any>>({
  onSubmit,
  fields,
  register,
  errors,
}: Props<T>) => {

  const dispatch = useDispatch<AppDispatch>();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex items-start gap-3">
          <label className="text-sm font-medium text-gray-700 w-32">
            {field.label}
          </label>
          <div className="w-full">
            {field.type === "textarea" ? (
              <textarea
                {...register(field.name)}
                className="w-full rounded outline-0 border-[1px] border-gray-200 px-2 py-1"
              />
            ) : (
              <input
                type={field.type ?? "text"}
                {...register(field.name)}
                className="w-full rounded outline-0 border-[1px] border-gray-200 px-2 py-1"
              />
            )}

            {errors[field.name] && (
              <p className="text-red-500 text-sm">
                {errors[field.name]?.message?.toString() ?? "Invalid field"}
              </p>
            )}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-end gap-2">
        <Button variant={"ghost"} type="button" className="text-black" onClick={()=>dispatch(setSelected(null))}>
          Cancel
        </Button>
        <Button type="submit">
          <Save />
          Submit
        </Button>
      </div>
    </form>
  );
};

export default CustomForm;
