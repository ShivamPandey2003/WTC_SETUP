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

const formSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  designation: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().min(5),
  external_link: z.string().refine((text) => {
    if (!text.trim()) return true;
    return [".com", ".in", ".ca"].some((domain) => text.includes(domain));
  }, "Invalid url"),
  linkedin_url: z.string().refine((text) => {
    if (!text.trim()) return true;
    return [".com", ".in", ".ca"].some((domain) => text.includes(domain));
  }, "Invalid url"),
  whatsapp_url: z.string().refine((text) => {
    if (!text.trim()) return true;
    return [".com", ".in", ".ca"].some((domain) => text.includes(domain));
  }, "Invalid url"),
});

type FormData = z.infer<typeof formSchema>;

export default function SpeakerForm() {
  const { speaker_info, user_info } = useSelector(
    (state: RootState) => state.Profile_Slice,
  );
  // const { UploadPic, isPending } = useUploadProfilePic();
  const [isPending, setIsPending] = useState(false);
  const { UpdateProfile, isPending: updateProfileIsPending } =
    useProfileUpdate();
  const [image, setImage] = useState<string | null>(
    speaker_info?.profile_image ?? null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: speaker_info?.firstname ?? "",
      lastname: speaker_info?.lastname ?? "",
      company: speaker_info?.company ?? "",
      designation: speaker_info?.designation ?? "",
      linkedin_url: speaker_info?.linkedin_url ?? "",
      whatsapp_url: speaker_info?.whatsapp_url ?? "",
      bio: speaker_info?.bio ?? "",
      external_link: speaker_info?.external_link ?? "",
    },
  });

  const onSubmit = (data: FormData) => {
    UpdateProfile({
      speaker_info: {
        firstname: data.firstname,
        lastname: data.lastname,
        company: data.company as string,
        designation: data.designation as string,
        linkedin_url: data.linkedin_url,
        profile_image: image as string,
        whatsapp_url: data.whatsapp_url as string,
        external_link: data.external_link as string,
        bio: data.bio as string,
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
        newForm.append("module", "speaker");
        // newForm.append("record_id", "");
        newForm.append("file_path", file_key);

        await apiRequest("post", "/user/profile/upload-image", newForm);
        setImage(URL.createObjectURL(file));
      } catch (error) {
        console.error("Image upload failed:", error);
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
            First Name
          </label>
          <div>
            <input
              {...register("firstname")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="First Name"
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm">{errors.firstname.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            Last Name
          </label>
          <div>
            <input
              {...register("lastname")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="Last Name"
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm">{errors.lastname.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            Company Name
          </label>
          <input
            {...register("company")}
            className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
            placeholder="Company"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            Designation
          </label>
          <input
            {...register("designation")}
            className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
            placeholder="Designation"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            LinkedIn
          </label>
          <div>
            <input
              {...register("linkedin_url")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="LinkedIn URL"
            />
            {errors.linkedin_url && (
              <p className="text-red-500 text-sm">{errors.linkedin_url.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            Whatsapp
          </label>
          <div>
            <input
              {...register("whatsapp_url")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="LinkedIn URL"
            />
            {errors.whatsapp_url && (
              <p className="text-red-500 text-sm">{errors.whatsapp_url.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            External
          </label>
          <div>
            <input
              {...register("external_link")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="LinkedIn URL"
            />
            {errors.external_link && (
              <p className="text-red-500 text-sm">{errors.external_link.message}</p>
            )}
          </div>
        </div>
        {/* <div className="w-full flex"> */}
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
