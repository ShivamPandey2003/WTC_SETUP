import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  useProfileUpdate,
  // useUploadProfilePic,
} from "@/api/Profile_api/Profile_api";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiRequest } from "@/services/apiService";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  full_name: z.string().min(1),
  url: z.string().refine((text) => {
    if (!text.trim()) return true;
    return [".com", ".in", ".ca", ".org", ".co", ".ai", ".net", ".io"].some(
      (domain) => text.includes(domain),
    );
  }, "Invalid url"),
  booth_no: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;

export default function ExhibitorForm() {
  const { exhibitor_info, user_info } = useSelector(
    (state: RootState) => state.Profile_Slice,
  );
  // const { UploadPic, isPending } = useUploadProfilePic();
  const [isPending, setIsPending] = useState(false);
  const { UpdateProfile, isPending: updateProfileIsPending } =
    useProfileUpdate();
  const [image, setImage] = useState<string | null>(
    exhibitor_info?.logo ?? null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: exhibitor_info?.full_name ?? "",
      url: exhibitor_info?.url ?? "",
      booth_no: exhibitor_info?.booth_no ?? "",
    },
  });

  const onSubmit = (data: FormData) => {
    UpdateProfile({
      exhibitor_info: {
        full_name: data.full_name,
        logo: image as string,
        url: data.url,
        booth_no: data.booth_no,
      },
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsPending(true);
        const res = await apiRequest(
          "post",
          `/upload/presigned-url?file_name=${file.name}&module=${"user_profile_image"}&ref_id=${user_info.image_id}`,
        );
        if (!res?.response?.response) return;
        const { file_key, upload_url } = res.response.response;

        await axios.put(upload_url, file, {
          headers: {
            "Content-Type": file.type,
          },
          responseType: "blob",
        });

        const newForm = new FormData();
        newForm.append("module", "exhibitor");
        // newForm.append("record_id", user_info.image_id);
        newForm.append("file_path", file_key);

        await apiRequest("post", "/user/profile/upload-image", newForm);
        const objectUrl = URL.createObjectURL(file);
        setImage((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return objectUrl;
        });
      } catch (error: any) {
        toast.error("Image upload failed:", error.message);
      } finally {
        setIsPending(false);
      }
    }
  };

  const handleRemoveImage = () => setImage(null);

  return (
    <div className="w-full sm:w-1/2 p-6 bg-white rounded-xl space-y-4 relative">
      {/* Profile Image */}
      <div className="flex items-end">
        {isPending ? (
          <div className="bg-gray-300 w-24 h-24 rounded-full flex items-center justify-center">
            <LoaderCircle className="animate-spin text-primary" />
          </div>
        ) : (
          <img
            src={
              image || "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div className="flex space-x-3 text-sm">
          <label className="cursor-pointer hover:underline">
            Change
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          {image && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            Full Name
          </label>
          <div>
            <input
              {...register("full_name")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="Full Name"
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm">{errors.full_name.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            Url
          </label>
          <div>
            <input
              {...register("url")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="https://......"
            />
            {errors.url && (
              <p className="text-red-500 text-sm">{errors.url.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            Booth No
          </label>
          <input
            {...register("booth_no")}
            className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
            placeholder="XXXX"
          />
        </div>
        <Button
          disabled={updateProfileIsPending}
          type="submit"
          className="w-[100px] py-1 h-7 absolute top-4 right-4"
        >
          Save
        </Button>
        {/* </div> */}
      </form>
    </div>
  );
}
