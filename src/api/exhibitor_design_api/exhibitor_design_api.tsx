import { apiRequest } from "@/services/apiService";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { queryClient } from "@/provider/TanstackProvider";
import { toast } from "sonner";
import {
  setIsCreating,
  setIsDeleting,
  setSelected,
  setUploadCSV,
} from "@/redux/ExhibitorSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";

// export const useGetExhibitorsList = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const {
//     data: Exhibitors,
//     isPending: isExhibitorsPending,
//     error: errorInError,
//   } = useQuery<ExhibitorListResponse, AxiosError>({
//     queryKey: ["exhibitor-design-list"],
//     queryFn: async () => {
//       const res = await apiRequest("get", "exhibitors/listing");
//       return res.response;
//     },
//     select: (data) => {
//       dispatch(
//         setExhibitors(
//           data.response.seq.flatMap((string) => [...data.response[string]]),
//         ),
//       );
//       return data;
//     },
//     refetchOnWindowFocus: false,
//     retry: 1,
//   });

//   return { Exhibitors, isExhibitorsPending, errorInError };
// };

export const useAdminInfiniteExhibitors = () => {
  const {
    data: AllExhibitors,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
    hasPreviousPage,
    status,
    error,
  } = useInfiniteQuery<GlobalAdminInfinityExhibitors, AxiosError>({
    queryKey: ["Admin-Exhibitors-pagination"],
    queryFn: async ({ pageParam }) => {
      const res = await apiRequest(
        "get",
        `exhibitors/listing?page=${pageParam}`,
      );
      return res.response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, max_page, next_page } = lastPage.response;
      if (current_page < max_page) return next_page;
      return undefined; // no more pages
    },
    refetchOnWindowFocus:false
  });

  return {
    AllExhibitors,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    status,
    error,
  };
};

export const useCreateExhibitor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: CreateExhibitor,
    isPending: isCreatePending,
    error,
  } = useMutation<ProfilePicResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "/exhibitors/add", data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Exhibitor created successfully");
      dispatch(setIsCreating(false));
      queryClient.invalidateQueries({ queryKey: ["Admin-Exhibitors-pagination"] });
    },
  });

  return { CreateExhibitor, isCreatePending, error };
};

export const useDeleteExibitor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: DeleteExibitor,
    isPending,
    error,
  } = useMutation<DeleteSessionResponse, AxiosError, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await apiRequest("delete", `/exhibitors/delete/${id}`);
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
      dispatch(setIsDeleting(null));
      queryClient.invalidateQueries({ queryKey: ["Admin-Exhibitors-pagination"] });
    },
  });

  return { DeleteExibitor, isPending, error };
};

export const useEditExhibitor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: EditExhibitor,
    isPending: isEditPending,
    error,
  } = useMutation<
    ProfilePicResponse,
    AxiosError,
    { form: FormData; id: string }
  >({
    mutationFn: async (data) => {
      const { id, form } = data;
      const res = await apiRequest("post", `exhibitors/edit/${id}`, form);
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
      dispatch(setSelected(null));
      queryClient.invalidateQueries({ queryKey: ["Admin-Exhibitors-pagination"] });
    },
  });

  return { EditExhibitor, isEditPending, error };
};

export const useUploadExhibitorsCSV = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    mutate: UploadExhibitorsCSV,
    isPending,
    error,
  } = useMutation<any, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest(
        "post",
        `/exhibitors/upload/exhibitors`,
        data,
      );
      return res.response;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exhibitors_upload_result.csv");

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("CSV downloaded successfully");
      queryClient.invalidateQueries({ queryKey: ["Admin-Exhibitors-pagination"] });
      dispatch(setUploadCSV(false));
    },
  });

  return { UploadExhibitorsCSV, isPending, error };
};

export const useUploadSplash = () => {
  const {
    mutate: UploadSplash,
    isPending,
    error,
  } = useMutation<LogoUpdateResponse, AxiosError, { form: FormData }>({
    mutationFn: async (data) => {
      const res = await apiRequest(
        "post",
        `/exhibitors/splash/upload`,
        data.form,
      );
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
    },
  });

  return { UploadSplash, isPending, error };
};

export const useExhibitorsDownload = () => {
  const { mutate: downloadExhibitor, isPending: isdownloadPending } =
    useMutation({
      mutationKey: ["exhibitors_download"],
      mutationFn: async () => {
        const res = await apiRequest(
          "get",
          "/exhibitors/download-exhibitors",
          null,
          "blob",
        );

        const contentDisposition = res.headers["content-disposition"];
        const blob = new Blob([res.response]);

        // Extract filename safely
        let filename = "exhibitors_list.csv";

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
    });

  return { downloadExhibitor, isdownloadPending };
};
