import { queryClient } from "@/provider/TanstackProvider";
import {
  setIsCreating,
  setIsDeleting,
  setSelected,
  setSpeaker,
  setSpeakerSettings,
} from "@/redux/SpeakerDesignSlice";
import type { AppDispatch } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useCreateSpeaker = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: CreateSpeaker,
    isPending,
    error,
  } = useMutation<CreateSpeakerResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "speakers/create", data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Speaker created successfully");
      queryClient.invalidateQueries({ queryKey: ["speakerList"] });
      dispatch(setIsCreating(false));
    },
    onError: (err) => {
      toast.error(`Error creating speaker: ${err.message}`);
    },
  });

  return { CreateSpeaker, isPending, error };
};

export const useEditSpeaker = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: EditSpeaker,
    isPending,
    error,
  } = useMutation<CreateSpeakerResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const id = data.get("id");
      const res = await apiRequest("post", `speakers/edit/${id}`, data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Speaker edited successfully");
      queryClient.invalidateQueries({ queryKey: ["speakerList"] });
      dispatch(setSelected(null));
    },
    onError: (err) => {
      toast.error(`Error editing speaker: ${err.message}`);
    },
  });

  return { EditSpeaker, isPending, error };
};

export const useGetSpeakerList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: SpeakerList,
    isPending,
    error,
  } = useQuery<SpeakerListResponse, AxiosError>({
    queryKey: ["speakerList"],
    queryFn: async () => {
      const res = await apiRequest("get", "speakers/list");
      return res.response;
    },
    select: (data) => {
      dispatch(setSpeaker(data.response));
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { SpeakerList, isPending, error };
};

export const useDeleteSpeaker = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: DeleteSpeaker,
    isPending,
    error,
  } = useMutation<DeleteSpeakerResponse, AxiosError, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await apiRequest("delete", `speakers/delete/${id}`);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Speaker deleted successfully");
      dispatch(setIsDeleting(null));
      queryClient.invalidateQueries({ queryKey: ["speakerList"] });
    },
    onError: (err) => {
      toast.error(`Error deleting speaker: ${err.message}`);
    },
  });

  return { DeleteSpeaker, isPending, error };
};

export const useGetSpeakerSetting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: SpeakerSettings,
    isPending,
    error,
  } = useQuery<SpeakerSettingResponse, AxiosError>({
    queryKey: ["Settings"],
    queryFn: async () => {
      const res = await apiRequest("get", "settings");
      return res.response;
    },
    select: (data) => {
      dispatch(setSpeakerSettings(data.response));
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { SpeakerSettings, isPending, error };
};
