import { setProfile } from "@/redux/ProfileSlice";
import type { AppDispatch } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useGetProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem("token");
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
    enabled: !!token
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
    }
  });

  return { UploadPic, isPending, error };
};

export const useProfileUpdate = () => {
  const {
    data:profileData,
    mutate: UpdateProfile,
    isPending,
    error,
  } = useMutation<ProfilePicResponse, AxiosError, ProfileUpdateRequest>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "/user/profile-info/update", data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Profile Update successfully");
    }
  });

  return { profileData, UpdateProfile, isPending, error };
};

export const useUploadExhibitorProfilePic = () => {
  const {
    mutate: UploadExhibitorPic,
    isPending,
    error,
  } = useMutation<ProfilePicResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "/exhibitors/update-logo", data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Profile pic update successfully");
    }
  });

  return { UploadExhibitorPic, isPending, error };
};