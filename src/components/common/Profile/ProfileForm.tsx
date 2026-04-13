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
  prefix: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["Male", "Female", "Other"], "Select a valid gender"),
  company: z.string().optional(),
  designation: z.string().optional(),
  email: z.email("Invalid email"),
  linkedin: z.string().refine((text) => {
    if (!text.trim()) return true;
    return [".com", ".in", ".ca", ".org", ".co", ".ai", ".net", ".io"].some((domain) => text.includes(domain));
  }, "Invalid url"),
  phone_number: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ProfileForm() {
  const { user_info } = useSelector((state: RootState) => state.Profile_Slice);
  // const { UploadPic, isPending } = useUploadProfilePic();
  const [isPending, setIsPending] = useState(false);
  const { UpdateProfile, isPending: updateProfileIsPending } =
    useProfileUpdate();
  const [image, setImage] = useState<string | null>(user_info.profile_image);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prefix: "",
      firstName: user_info.firstname,
      lastName: user_info.lastname,
      gender: user_info.gender as any,
      company: user_info.company_name as string,
      designation: user_info.designation as string,
      email: user_info.email,
      linkedin: user_info.linkedin_url || "",
    },
  });

  const onSubmit = (data: FormData) => {
    UpdateProfile({
      user_info: {
        firstname: data.firstName,
        lastname: data.lastName,
        gender: data.gender,
        email:user_info.email,
        company_name: data.company as string,
        designation: data.designation as string,
        linkedin_url: data.linkedin,
        // profile_image: image as string,
        phone_number: data.phone_number as string,
        image_id:user_info.image_id
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
        newForm.append("module", "user");
        // newForm.append("record_id", user_info.image_id);
        newForm.append("file_path", file_key);

        await apiRequest("post", "/user/profile/upload-image", newForm);
        const objectUrl = URL.createObjectURL(file);
        setImage((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return objectUrl;
        });
      } catch (error:any) {
        toast.error("Image upload failed:", error.message);
      } finally {
        setIsPending(false);
      }
    }
  };

  const handleRemoveImage = () => setImage(null);

  return (
    <div className=" p-6 bg-white rounded-xl space-y-4 relative">
      <p className="font-semibold">Your Profile</p>
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
          <label className="text-sm font-medium text-gray-600 sm:w-[170px]">
            Name Prefix
          </label>
          <input
            {...register("prefix")}
            className="border border-[#ddd] outline-0 rounded-md p-2 w-full sm:w-[500px]"
            placeholder="Dr."
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            First Name
          </label>
          <div>
            <input
              {...register("firstName")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="First Name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            Last Name
          </label>
          <div>
            <input
              {...register("lastName")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="Last Name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            Gender
          </label>
          <div>
            <select
              {...register("gender")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
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
            Email
          </label>
          <div>
            <input
              disabled
              {...register("email")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            Phone Number
          </label>
          <div>
            <input
              {...register("phone_number")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="+1xxxxxxxx"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.phone_number?.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="block text-sm font-medium text-gray-600 sm:w-[170px]">
            LinkedIn
          </label>
          <div>
            <input
              {...register("linkedin")}
              className="w-full sm:w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="LinkedIn URL"
            />
            {errors.linkedin && (
              <p className="text-red-500 text-sm">{errors.linkedin.message}</p>
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
