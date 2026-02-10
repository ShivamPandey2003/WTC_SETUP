import React, { useState } from "react";
import {
  type FieldErrors,
  type UseFormRegister,
  type Path,
  type UseFormWatch,
  type UseFormSetValue,
} from "react-hook-form";
import { Button } from "../ui/Button";
import { Save, X, Plus } from "lucide-react";

type FieldConfig<T extends Record<string, any>> = {
  name: Path<T>;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "number"
    | "file"
    | "file-new"
    | "checkbox"
    | "date"
    | "array-string"
    | "array-attachment"
    | "time"
    | "select";
  placeholder?: string;
  accept?: string;
  options?: { label: string; value: string }[];
  addMoreHandler?: () => void;
  file?: File;
};

type Props<T extends Record<string, any>> = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  fields: FieldConfig<T>[];
  register: UseFormRegister<T>;
  setValue?: UseFormSetValue<T>;
  watch?: UseFormWatch<T>;
  errors: FieldErrors<T>;
  isLoading: boolean;
  onClose: () => void;
};

const CustomForm = <T extends Record<string, any>>({
  onSubmit,
  fields,
  register,
  errors,
  isLoading,
  onClose,
  watch,
  setValue,
}: Props<T>) => {
  const [arrayStrings, setArrayStrings] = useState<Record<string, string[]>>(
    {},
  );
  const [arrayAttachments, setArrayAttachments] = useState<
    Record<string, File[]>
  >({});

  const handleAddStringToArray = (fieldName: string) => {
    setArrayStrings((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), ""],
    }));
  };

  const handleRemoveStringFromArray = (fieldName: string, index: number) => {
    setArrayStrings((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  const handleUpdateString = (
    fieldName: string,
    index: number,
    value: string,
  ) => {
    setArrayStrings((prev) => {
      const updated = [...(prev[fieldName] || [])];
      updated[index] = value;
      return { ...prev, [fieldName]: updated };
    });
  };

  const handleAddAttachment = (fieldName: string, files: FileList | null) => {
    if (!files) return;
    setArrayAttachments((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), ...Array.from(files)],
    }));
  };

  const handleRemoveAttachment = (fieldName: string, index: number) => {
    setArrayAttachments((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    arrayStrings &&
      Object.entries(arrayStrings).forEach(([key, values]) => {
        values.forEach((value) => {
          formData.append(`${key}`, value);
        });
      });

    arrayAttachments &&
      Object.entries(arrayAttachments).forEach(([key, files]) => {
        files.forEach((file) => {
          formData.append(`${key}`, file);
        });
      });

    onSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex items-start gap-3">
          {
            <label className="text-sm font-medium text-gray-700 w-32 pt-1">
              {field.label}
            </label>
          }
          <div className="w-full">
            {field.type === "textarea" ? (
              <textarea
                {...register(field.name)}
                placeholder={field.placeholder}
                className="w-full rounded outline-0 border-[1px] border-gray-200 px-2 py-1 focus:border-primary"
                rows={1}
              />
            ) : field.type === "checkbox" ? (
              <div className="flex items-center gap-2 pt-1.5">
                <input
                  type="checkbox"
                  {...register(field.name)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            ) : field.type === "file" ? (
              <input
                type="file"
                multiple={false}
                {...register(field.name)}
                accept={field.accept}
                className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            ) : field.type === "date" ? (
              <input
                type="date"
                {...register(field.name)}
                className="w-full rounded outline-0 border border-gray-200 px-2 py-1 focus:border-primary"
              />
            ) : field.type === "time" ? (
              <input
                type="time"
                {...register(field.name)}
                className="w-fit rounded outline-0 border border-gray-200 px-2 py-1 focus:border-primary"
              />
            ) : field.type === "array-string" ? (
              <div className="space-y-2">
                {(arrayStrings[field.name] || []).map((value, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        handleUpdateString(
                          field.name as string,
                          index,
                          e.target.value,
                        )
                      }
                      placeholder={field.placeholder}
                      className="flex-1 rounded outline-0 border-[1px] border-gray-200 px-2 py-1 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveStringFromArray(field.name as string, index)
                      }
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddStringToArray(field.name as string)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-bgCard text-primary rounded hover:bg-blue-100 transition-colors"
                >
                  <Plus size={16} />
                  Add {field.label}
                </button>
              </div>
            ) : field.type === "array-attachment" ? (
              <div className="space-y-2">
                {(arrayAttachments[field.name] || []).map((file, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center p-2 bg-gray-50 rounded border border-gray-200"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveAttachment(field.name as string, index)
                      }
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
                <input
                  type="file"
                  multiple
                  accept={field.accept}
                  onChange={(e) =>
                    handleAddAttachment(field.name as string, e.target.files)
                  }
                  className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-bgCard file:text-primary hover:file:bg-blue-100"
                />
              </div>
            ) : field.type === "select" ? (
              <div className="flex flex-col">
                <select
                  {...register(field.name)}
                  // defaultValue={""}
                  className="w-full rounded outline-0 border border-gray-200 px-2 py-1 focus:border-primary mb-1"
                >
                  <option value="">
                    {field.placeholder || "Select an option"}
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {field.addMoreHandler && (
                  <div
                    className="flex items-center self-end text-primary cursor-pointer hover:underline text-sm"
                    onClick={field.addMoreHandler}
                  >
                    <Plus size={16} />
                    Add more
                  </div>
                )}
              </div>
            ) : field.type === "file-new" ? (
              <div className="space-y-2">
                <input
                  type="file"
                  accept={field.accept}
                  multiple={false}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!setValue)return;
                      setValue(field.name, file as any, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                  }}
                  className="w-full text-sm text-gray-700
        file:mr-4 file:py-2 file:px-4
        file:rounded file:border-0
        file:text-sm file:font-medium
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
                />

                {/* Optional but recommended */}
                {watch && watch(field.name) as any instanceof File && (
                  <img
                    src={URL.createObjectURL(watch(field.name))}
                    className="h-24 rounded border object-cover"
                  />
                )}
              </div>
            ) : (
              <input
                type={field.type ?? "text"}
                {...register(field.name, {
                  valueAsNumber: field.type === "number",
                })}
                placeholder={field.placeholder}
                className="w-full rounded outline-0 border-[1px] border-gray-200 px-2 py-1 focus:border-primary"
              />
            )}

            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name]?.message?.toString() ?? "Invalid field"}
              </p>
            )}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-end gap-2 pt-4">
        <Button
          variant="ghost"
          type="button"
          className="text-black"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save size={16} />
          Submit
        </Button>
      </div>
    </form>
  );
};

export default CustomForm;
