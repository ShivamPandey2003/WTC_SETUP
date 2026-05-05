import { apiRequest } from "@/services/apiService";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
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
import axios from "axios";

export const useGetExhibitorsList = (page: number = 1, search?: string) => {
  const url =
    search && search.trim()
      ? `exhibitors/listing?page=${page}&search=${search}`
      : `exhibitors/listing?page=${page}`;

  const {
    data: Exhibitors,
    isPending: isExhibitorsPending,
    error: errorInError,
  } = useQuery<ExhibitorListResponse, AxiosError>({
    queryKey: ["exhibitor-design-list", page, search],
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

  return { Exhibitors, isExhibitorsPending, errorInError };
};

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
    getPreviousPageParam: (lastPage) => {
      const { next_page } = lastPage.response;
      return next_page - 1 !== 0 ? next_page - 1 : undefined;
    },
    refetchOnWindowFocus: false,
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
      const cloned = new FormData();

      for (let [key, value] of data.entries()) {
        cloned.append(key, value);
      }

      cloned.delete("logo");
      const res = await apiRequest("post", "/exhibitors/add", cloned);
      return res.response;
    },
    onSuccess: async (data, variable) => {
      toast.success("Exhibitor created successfully");
      dispatch(setIsCreating(false));

      const file = variable.get("logo") as File;

      if (file) {
        const res = await apiRequest(
          "post",
          `/upload/presigned-url?file_name=${file.name}&module=${"exhibitors_logo"}&ref_id=${data.response.id}`,
        );
        const { file_key, upload_url } = res.response.response;

        await axios.put(upload_url, file, {
          headers: {
            "Content-Type": file.type,
          },
          responseType: "blob",
        });

        const newForm = new FormData();
        newForm.append("module", "exhibitor");
        newForm.append("record_id", data.response.id);
        newForm.append("file_path_image", file_key);

        await apiRequest("post", "upload/common/files", newForm);
      }

      queryClient.invalidateQueries({
        queryKey: ["exhibitor-design-list"],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["exhibitor-design-list"],
      });
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
      const cloned = new FormData();

      for (let [key, value] of form.entries()) {
        cloned.append(key, value);
      }

      cloned.delete("logo");
      const res = await apiRequest("post", `exhibitors/edit/${id}`, cloned);
      return res.response;
    },
    onSuccess: async (data, variable) => {
      toast.success(data.header.message);
      dispatch(setSelected(null));

      const file = variable.form.get("logo") as File;

      if (file) {
        const res = await apiRequest(
          "post",
          `/upload/presigned-url?file_name=${file.name}&module=${"exhibitors_logo"}&ref_id=${data.response.id}`,
        );
        const { file_key, upload_url } = res.response.response;

        await axios.put(upload_url, file, {
          headers: {
            "Content-Type": file.type,
          },
          responseType: "blob",
        });

        const newForm = new FormData();
        newForm.append("module", "exhibitor");
        newForm.append("record_id", data.response.id);
        newForm.append("file_path_image", file_key);

        await apiRequest("post", "upload/common/files", newForm);
      }

      queryClient.invalidateQueries({
        queryKey: ["exhibitor-design-list"],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["exhibitor-design-list"],
      });
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
        toast.info("Preparing file for download");
      },
      onSuccess: () => {
        toast.success("File ready");
      },
    });

  return { downloadExhibitor, isdownloadPending };
};
