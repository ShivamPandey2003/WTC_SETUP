import { queryClient } from "@/provider/TanstackProvider";
import {
  setIsCreating,
  setIsDeleting,
  setIsPublished,
  setNews,
  setSelected,
} from "@/redux/HomeDesignSlice";
import type { AppDispatch } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useCreateNews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: CreateNews,
    isPending,
    error,
  } = useMutation<NewsCreateResponse, AxiosError, NewCreateRequest>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "news/create", data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("News created successfully");
      queryClient.invalidateQueries({ queryKey: ["newsList"] });
      dispatch(setIsCreating(false));
    },
    onError: (err) => {
      toast.error(`Error creating news: ${err.message}`);
    },
  });

  return { CreateNews, isPending, error };
};

export const useEditNews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: EditNews,
    isPending,
    error,
  } = useMutation<
    NewsCreateResponse,
    AxiosError,
    NewCreateRequest & { id: string }
  >({
    mutationFn: async (data) => {
      const { id, ...rest } = data;
      const res = await apiRequest("post", `news/edit/${id}`, rest);
      return res.response;
    },
    onSuccess: () => {
      toast.success("News edited successfully");
      dispatch(setSelected(null));
      queryClient.invalidateQueries({ queryKey: ["newsList"] });
    },
    onError: (err) => {
      toast.error(`Error editing news: ${err.message}`);
    },
  });

  return { EditNews, isPending, error };
};

export const useGetNewsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: NewsList,
    isPending: isNewsListPending,
    error: errorInNewsList,
  } = useQuery<NewsListResponse, AxiosError>({
    queryKey: ["newsList"],
    queryFn: async () => {
      const res = await apiRequest("get", "news/list");
      return res.response;
    },
    select: (data) => {
      dispatch(setNews(data.response));
      return data;
    },
    refetchOnWindowFocus: false,
    retry:1
  });

  return { NewsList, isNewsListPending, errorInNewsList };
};

export const useDeleteNews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: DeleteNews,
    isPending,
    error,
  } = useMutation<DeleteNewsResponse, AxiosError, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await apiRequest("delete", `news/${id}`);
      return res.response;
    },
    onSuccess: () => {
      toast.success("News deleted successfully");
      dispatch(setIsDeleting(null));
      queryClient.invalidateQueries({ queryKey: ["newsList"] });
    },
    onError: (err) => {
      toast.error(`Error deleting news: ${err.message}`);
    },
  });

  return { DeleteNews, isPending, error };
};

export const usePublishedNews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: PulishedNew,
    isPending,
    error,
  } = useMutation<DeleteNewsResponse, AxiosError, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await apiRequest("post", `news/publish/${id}`);
      return res.response;
    },
    onSuccess: () => {
      toast.success("News Published successfully");
      queryClient.invalidateQueries({ queryKey: ["newsList"] });
      dispatch(setIsPublished(null));
    },
    onError: (err) => {
      toast.error(`Error Publishing news: ${err.message}`);
    },
  });

  return { PulishedNew, isPending, error };
};
