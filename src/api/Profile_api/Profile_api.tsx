import { setProfile } from "@/redux/ProfileSlice";
import type { AppDispatch } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useGetProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: Profile,
    isPending,
    error,
  } = useQuery<ProfileResponse, AxiosError>({
    queryKey: ["Profile"],
    queryFn: async () => {
      const res = await apiRequest("get", "user/profile/info");
      return res.response;
    },
    select: (data) => {
      dispatch(setProfile(data.response));
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { Profile, isPending, error };
};

export const useUploadProfilePic = () => {
  const {
    mutate: UploadPic,
    isPending,
    error,
  } = useMutation<ProfilePicResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "user/profile/upload-image", data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Profile pic update successfully");
    },
    onError: (err) => {
      toast.error(`Error updating profile pic: ${err.message}`);
    },
  });

  return { UploadPic, isPending, error };
};

export const useProfileUpdate = () => {
  const {
    mutate: UpdateProfile,
    isPending,
    error,
  } = useMutation<ProfilePicResponse, AxiosError, ProfileUpdateRequest>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "user/profile/update", data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Profile Update successfully");
    },
    onError: (err) => {
      toast.error(`Error updating profile: ${err.message}`);
    },
  });

  return { UpdateProfile, isPending, error };
};