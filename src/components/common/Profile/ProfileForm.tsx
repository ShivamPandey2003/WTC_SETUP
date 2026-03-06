import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  useProfileUpdate,
  useUploadProfilePic,
} from "@/api/Profile_api/Profile_api";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const formSchema = z.object({
  prefix: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  company: z.string().optional(),
  designation: z.string().optional(),
  email: z.email("Invalid email"),
  linkedin: z.url("Invalid URL"),
});

type FormData = z.infer<typeof formSchema>;

export default function ProfileForm() {
  const { user_info } = useSelector((state: RootState) => state.Profile_Slice);
  const { UploadPic, isPending } = useUploadProfilePic();
  const { UpdateProfile } = useProfileUpdate();
  const [image, setImage] = useState<string | null>(
    user_info.profile_image
  );

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
      gender: "Male",
      company: user_info.company_name as string,
      designation: user_info.designation as string,
      email: user_info.email,
      linkedin: user_info.linkedin_url as string,
    },
  });

  const onSubmit = (data: FormData) => {
    UpdateProfile({
      name_prefix: data.prefix as string,
      firstname: data.firstName,
      lastname: data.lastName,
      gender: data.gender,
      company_name: data.company as string,
      designation: data.designation as string,
      linkedin_url: data.linkedin,
      // user_image: image as string,
      phone_number: user_info.phone_number as string,
    });
    // alert("Saved!");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newForm = new FormData();
    const file = e.target.files?.[0];
    if (file) {
      newForm.append("file", file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      UploadPic(newForm);
    }
  };

  const handleRemoveImage = () => setImage(null);

  return (
    <div className="w-4/5 mx-auto p-6 bg-white rounded-xl space-y-4 relative">
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
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-600 w-[170px]">
            Name Prefix
          </label>
          <input
            {...register("prefix")}
            className="border border-[#ddd] outline-0 rounded-md p-2 w-[500px]"
            placeholder="Dr."
          />
        </div>

        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            First Name
          </label>
          <div>
            <input
              {...register("firstName")}
              className="w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="First Name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            Last Name
          </label>
          <div>
            <input
              {...register("lastName")}
              className="w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="Last Name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            Gender
          </label>
          <select
            {...register("gender")}
            className="w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            Company Name
          </label>
          <input
            {...register("company")}
            className="w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
            placeholder="Company"
          />
        </div>

        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            Designation
          </label>
          <input
            {...register("designation")}
            className="w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
            placeholder="Designation"
          />
        </div>

        {/* <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            Email
          </label>
          <div>
            <input
              {...register("email")}
              className="w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div> */}

        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            LinkedIn
          </label>
          <div>
            <input
              {...register("linkedin")}
              className="w-[500px] border border-[#ddd] outline-0 rounded-md p-2"
              placeholder="LinkedIn URL"
            />
            {errors.linkedin && (
              <p className="text-red-500 text-sm">{errors.linkedin.message}</p>
            )}
          </div>
        </div>
        {/* <div className="w-full flex"> */}
        <Button
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
