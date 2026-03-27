import { CustomPick } from "@/lib/utils";
import { queryClient } from "@/provider/TanstackProvider";
import {
  setIsCreating,
  setIsDeleting,
  setIsPublished,
  setIsUnpublished,
  setSelected,
  setUploadCSV,
} from "@/redux/HomeDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const useCreateNews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: CreateNews,
    isPending,
    error,
  } = useMutation<NewsCreateResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "news/create", data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("News created successfully");
      queryClient.invalidateQueries({ queryKey: ["newsList"] });
      dispatch(setIsCreating(false));
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
  } = useMutation<NewsCreateResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const id = data.get("id");
      const res = await apiRequest("post", `news/edit/${id}`, data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("News edited successfully");
      dispatch(setSelected(null));
      queryClient.invalidateQueries({ queryKey: ["newsList"] });
    },
  });

  return { EditNews, isPending, error };
};

export const useGetNewsList = (page:number = 1, search?:string) => {

  const url = (search && search.trim())? `news/list?page=${page}&search=${search}`:`news/list?page=${page}`;

  const {
    data: NewsList,
    isPending: isNewsListPending,
    error: errorInNewsList,
  } = useQuery<GlobalInfinityNews, AxiosError>({
    queryKey: ["newsList", page, search],
    queryFn: async () => {
      const res = await apiRequest("get", url);
      return res.response;
    },
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { NewsList, isNewsListPending, errorInNewsList };
};

// export const useAdminInfiniteNews = () => {
//   const {
//     data: AllNews,
//     fetchNextPage,
//     fetchPreviousPage,
//     hasPreviousPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//     error,
//   } = useInfiniteQuery<GlobalInfinityNews, AxiosError>({
//     queryKey: ["Admin-News-pagination"],
//     queryFn: async ({ pageParam }) => {
//       const res = await apiRequest("get", `news/list?page=${pageParam}`);
//       return res.response;
//     },
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => {
//       const { current_page, max_page, next_page } = lastPage.response;
//       if (current_page < max_page) return next_page;
//       return undefined; // no more pages
//     },
//     refetchOnWindowFocus:false
//   });

//   return {
//     AllNews,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//     error,
//     fetchPreviousPage,
//     hasPreviousPage
//   };
// };

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
  });

  return { DeleteNews, isPending, error };
};

export const usePublishedNews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: PulishedNew,
    isPending,
    error,
  } = useMutation<
    DeleteNewsResponse,
    AxiosError,
    { id: string; is_publish: number }
  >({
    mutationFn: async ({ id, is_publish }) => {
      const data = new FormData();
      data.append("is_publish", String(is_publish));
      const res = await apiRequest("post", `news/publish/${id}`, data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("News Published successfully");
      queryClient.invalidateQueries({ queryKey: ["newsList"] });
      dispatch(setIsPublished(null));
      dispatch(setIsUnpublished(null));
    },
  });

  return { PulishedNew, isPending, error };
};

export const useUploadNewsCSV = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    mutate: UploadNewsCSV,
    isPending,
    error,
  } = useMutation<any, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", `/news/upload/news_list`, data);
      return res.response;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "news_upload_result.csv");

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("CSV downloaded successfully");
      queryClient.invalidateQueries({ queryKey: ["newsList"] });
      dispatch(setUploadCSV(false));
    },
  });

  return { UploadNewsCSV, isPending, error };
};

export const useUpdateSplash = () => {
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice,
  );

  const data = CustomPick(appConfig, ["show_splash", "show_exhibitor_splash"]);
  const {
    mutate: UpdateSplashActivation,
    isPending,
    error,
  } = useMutation<LogoUpdateResponse, AxiosError>({
    mutationFn: async () => {
      const res = await apiRequest("post", `/general/splash/visibility`, {
        exhibitor_splash: data.show_exhibitor_splash,
        splash: data.show_splash,
      });
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
    },
  });

  return { UpdateSplashActivation, isPending, error };
};

export const useHeroCarusole = () => {
  const {
    data: HeroCarusole,
    isPending: isHeroCarusole,
    error: errorHeroCarusole,
    refetch
  } = useQuery<HeroCarusoleT, AxiosError>({
    queryKey: ["hero_carusole"],
    queryFn: async () => {
      const res = await apiRequest("get", "/main/carusole");
      return res.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { HeroCarusole, isHeroCarusole, errorHeroCarusole, refetch };
};

export const useUploadNewsImages = () => {
  const {
    mutate: UploadBulkImages,
    isPending,
    data,
    isError,
  } = useMutation<
    BulkImageResponse,
    AxiosError,
    { type: number; form: FormData }
  >({
    mutationFn: async ({ type, form }) => {
      const res = await apiRequest("post", `/upload/images?type=${type}`, form);
      return res.response;
    },
  });

  return { UploadBulkImages, isPending, data, isError };
};

export const useNewsDownload = () => {
  const { mutate: downloadNews, isPending: isdownloadPending } = useMutation(
    {
      mutationKey: ["session_download"],
      mutationFn: async () => {
        const res = await apiRequest(
          "get",
          "/news/download-news",
          null,
          "blob",
        );

        const contentDisposition = res.headers["content-disposition"];
        const blob = new Blob([res.response]);

        // Extract filename safely
        let filename = "news_list.csv";

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

  return { downloadNews, isdownloadPending };
};