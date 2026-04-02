import { queryClient } from "@/provider/TanstackProvider";
import {
  setIsCreating,
  setIsDeleting,
  setSelected,
  setSpeakerSettings,
  setUploadCSV,
  type payload,
} from "@/redux/SpeakerDesignSlice";
import type { AppDispatch } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
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
      queryClient.invalidateQueries({
        queryKey: ["adminSpeakerList"],
      });
      dispatch(setIsCreating(false));
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
      queryClient.invalidateQueries({
        queryKey: ["adminSpeakerList"],
      });
      dispatch(setSelected(null));
    },
  });

  return { EditSpeaker, isPending, error };
};

export const useAdminInfiniteSpeakers = () => {
  const {
    data: AllSpeakers,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<GlobalInfinitySpeakers, AxiosError>({
    queryKey: ["Admin-Speakers-pagination"],
    queryFn: async ({ pageParam }) => {
      const res = await apiRequest("get", `speakers/list?page=${pageParam}`);
      return res.response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, max_page, next_page } = lastPage.response;
      if (current_page < max_page) return next_page;
      return undefined; // no more pages
    },
    refetchOnWindowFocus: false,
  });

  return {
    AllSpeakers,
    fetchNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    isFetchingPreviousPage,
  };
};

export const useGetSpeakerList = () => {
  const {
    data: SpeakerList,
    isPending,
    error,
  } = useQuery<AllSpeakerListResponse, AxiosError>({
    queryKey: ["speakerList"],
    queryFn: async () => {
      const res = await apiRequest("get", "all-speakers");
      return res.response;
    },
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { SpeakerList, isPending, error };
};

export const useGetAdminSpeakerList = (page: number = 1, search?:string) => {

  const url = (search && search?.trim()) ? `speakers/list?page=${page}&search=${search}`:`speakers/list?page=${page}`

  const {
    data: SpeakerList,
    isPending,
    error,
  } = useQuery<GlobalInfinitySpeakers, AxiosError>({
    queryKey: ["adminSpeakerList", page, search],
    queryFn: async () => {
      const res = await apiRequest("get", url);
      return res.response;
    },
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 0,
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
      queryClient.invalidateQueries({
        queryKey: ["adminSpeakerList"],
      });
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
      dispatch(setSpeakerSettings(data.response as payload));
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime:0
  });

  return { SpeakerSettings, isPending, error };
};

export const useUploadSpeakerCSV = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    mutate: UploadSpeakerCSV,
    isPending,
    error,
  } = useMutation<any, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", `/speakers/upload/speakers`, data);
      return res.response;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "speakers_upload_result.csv");

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("CSV downloaded successfully");
      queryClient.invalidateQueries({
        queryKey: ["adminSpeakerList"],
      });
      dispatch(setUploadCSV(false));
    },
  });

  return { UploadSpeakerCSV, isPending, error };
};

export const useSpeakerDownload = () => {
  const { mutate: downloadSpeaker, isPending: isdownloadPending } = useMutation(
    {
      mutationKey: ["speaker_download"],
      mutationFn: async () => {
        const res = await apiRequest("get", "/speakers/download", null, "blob");

        const contentDisposition = res.headers["content-disposition"];
        const blob = new Blob([res.response]);

        let filename = "speaker_list.csv";

        if (contentDisposition?.includes("filename=")) {
          filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
        }

        const url = window.URL.createObjectURL(res.response);
        const link = document.createElement("a");

        link.href = url;
        link.download = filename; // cleaner way
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return blob;
      },
      onMutate: () => {
        toast.info("File is preparing for download");
      },
      onSuccess: () => {
        toast.success("File download successfully");
      },
    },
  );

  return { downloadSpeaker, isdownloadPending };
};
