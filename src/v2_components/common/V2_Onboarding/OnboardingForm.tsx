import {
  useGetProfile,
  useProfileUpdate,
  useUploadProfilePic,
} from "@/api/Profile_api/Profile_api";
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const formSchema = z.object({
  prefix: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  company: z.string().nullable().optional(),
  designation: z.string().nullable().optional(),
  linkedin: z.url("Invalid URL").nullable(),
});

type FormData = z.infer<typeof formSchema>;

const OnboardingForm = () => {
  const { Profile, isPending: ProfilePending } = useGetProfile();
  const { UploadPic, isPending } = useUploadProfilePic();
  const { UpdateProfile, profileData } = useProfileUpdate();
  const [image, setImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!Profile) return;
    if (!Profile.response.user_info) return;
    const user = Profile.response.user_info;
    reset({ firstName: user.firstname, lastName: user.lastname });
  }, [Profile, reset]);

  const onSubmit = (data: FormData) => {
    UpdateProfile({
      name_prefix: data.prefix as string,
      firstname: data.firstName,
      lastname: data.lastName,
      gender: data.gender,
      company_name: data.company as string,
      designation: data.designation as string,
      linkedin_url: data.linkedin as string,
      // user_image: image as string,
      phone_number: Profile?.response.user_info.phone_number as string,
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

  useEffect(() => {
    if (profileData?.header.code === 200) {
      navigate("/");
    }
  }, [profileData]);

  if (ProfilePending) {
    return (
      <div className="h-[30vh] flex items-center justify-center">
        <Loader2 size={24} className={`text-primary animate-spin`} />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto mt-4 bg-white rounded-xl space-y-2 relative">
      {/* Profile Image */}
      <div className="flex flex-col items-center justify-start mb-4">
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
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <div className="flex space-x-3 text-sm">
          <label className="cursor-pointer hover:underline font-bold">
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
              className="hover:underline text-red-500 font-bold"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex items-center justify-center">
          <label className="text-sm font-medium text-gray-600 w-[170px]">
            Name Prefix
          </label>
          <input
            {...register("prefix")}
            className="border border-[#ddd] outline-0 rounded-md px-2 py-1 w-[400px]"
            placeholder="Dr."
          />
        </div>

        <div className="flex items-center justify-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            First Name
          </label>
          <div>
            <input
              {...register("firstName")}
              className="w-[400px] border border-[#ddd] outline-0 rounded-md px-2 py-1"
              placeholder="First Name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            Last Name
          </label>
          <div>
            <input
              {...register("lastName")}
              className="w-[400px] border border-[#ddd] outline-0 rounded-md px-2 py-1"
              placeholder="Last Name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            Gender
          </label>
          <select
            {...register("gender")}
            className="w-[400px] border border-[#ddd] outline-0 rounded-md px-2 py-1"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center justify-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            Company Name
          </label>
          <input
            {...register("company")}
            className="w-[400px] border border-[#ddd] outline-0 rounded-md px-2 py-1"
            placeholder="Company"
          />
        </div>

        <div className="flex items-center justify-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            Designation
          </label>
          <input
            {...register("designation")}
            className="w-[400px] border border-[#ddd] outline-0 rounded-md px-2 py-1"
            placeholder="Designation"
          />
        </div>

        {/* <div className="flex items-center justify-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            Email
          </label>
          <div>
            <input
              {...register("email")}
              className="w-[400px] border border-[#ddd] outline-0 rounded-md px-2 py-1"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div> */}

        <div className="flex items-center justify-center">
          <label className="block text-sm font-medium text-gray-600 w-[170px]">
            LinkedIn
          </label>
          <div>
            <input
              {...register("linkedin")}
              className="w-[400px] border border-[#ddd] outline-0 rounded-md px-2 py-1"
              placeholder="LinkedIn URL"
            />
            {errors.linkedin && (
              <p className="text-red-500 text-sm">{errors.linkedin.message}</p>
            )}
          </div>
        </div>
        <div className="w-full flex gap-4 justify-end">
          <Button
            variant={"ghost"}
            className="w-[100px] py-1 h-7"
            onClick={() => navigate("/")}
          >
            Skip for now
          </Button>
          <Button type="submit" className="w-[100px] py-1 h-7">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingForm;
