import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useCreateNews = () => {
  const {
    mutate: CreateNews,
    isPending,
    error,
  } = useMutation<NewsCreateResponse, AxiosError, NewCreateRequest>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "news/create", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("News created successfully");
    },
    onError: (err, Variable) => {
      toast.error(`Error creating news: ${err.message}`);
      console.log(Variable);
    },
  });

  return { CreateNews, isPending, error };
};

export const useEditNews = () => {
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
      return res.data;
    },
    onSuccess: () => {
      toast.success("News edited successfully");
    },
    onError: (err, Variable) => {
      toast.error(`Error editing news: ${err.message}`);
      console.log(Variable);
    },
  });

  return { EditNews, isPending, error };
};

export const useGetNewsList = () => {
  const {
    data: NewsList,
    isPending,
    error,
  } = useQuery<NewsListResponse, AxiosError>({
    queryKey: ["newsList"],
    queryFn: async () => {
      const res = await apiRequest("get", "news/list");
      return res.data;
    },
    select: (data) => {
      return data;
    },
  });

  return { NewsList, isPending, error };
};

export const useDeleteNews = () => {
  const {
    mutate: DeleteNews,
    isPending,
    error,
  } = useMutation<DeleteNewsResponse, AxiosError, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await apiRequest("delete", `news/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("News deleted successfully");
    },
    onError: (err, Variable) => {
      toast.error(`Error deleting news: ${err.message}`);
      console.log(Variable);
    },
  });

  return { DeleteNews, isPending, error };
};

export const usePublishedNews = () => {
    const {
    mutate: PulishedNew,
    isPending,
    error,
  } = useMutation<DeleteNewsResponse, AxiosError, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await apiRequest("post", `news/publish/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("News Published successfully");
    },
    onError: (err, Variable) => {
      toast.error(`Error Publishing news: ${err.message}`);
      console.log(Variable);
    },
  });

  return { PulishedNew, isPending, error };
}
