import { queryClient } from "@/provider/TanstackProvider";
import { setDeletingCategory, setIsEditable } from "@/redux/ExhibitorSlice";
import {
  setCategoryModal,
  setIsCreating,
  setIsDeleting,
  setSelected,
  setUploadCSV,
} from "@/redux/ProgrammeDesignSlice";
import { setCategoryModal as exhibitorCategoryModal } from "@/redux/ExhibitorSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { uploadWithLimit } from "@/services/uploadWithLimit";

export const useCreateSession = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: CreateSession,
    isPending,
    error,
  } = useMutation<CreateSessionResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const cloned = new FormData();

      for (let [key, value] of data.entries()) {
        cloned.append(key, value);
      }
      cloned.delete("bg_image");
      cloned.delete("attachment");
      const res = await apiRequest("post", "programme/create", cloned);
      return res.response;
    },
    onSuccess: async (data, variable) => {
      toast.success("Session created successfully");
      dispatch(setIsCreating(false));
      const file = variable.get("bg_image") as File;
      const attachment = variable.getAll("attachment") as File[];

      if (file) {
        const res = await apiRequest(
          "post",
          `/upload/presigned-url?file_name=${file.name}&module=${"programme_bg"}&ref_id=${data.response.id}`,
        );
        const { file_key, upload_url } = res.response.response;

        await axios.put(upload_url, file, {
          headers: {
            "Content-Type": file.type,
          },
          responseType: "blob",
        });

        const newForm = new FormData();
        newForm.append("module", "programme");
        newForm.append("record_id", data.response.id);
        newForm.append("type", "3");
        newForm.append("file_path_image", file_key);

        await apiRequest("post", "upload/common/files", newForm);
      }

      if (attachment && attachment.length > 0) {
        await uploadWithLimit(attachment, data.response.id, [
          "programme_attachments",
          "programme",
        ]);
      }

      queryClient.invalidateQueries({
        queryKey: ["sessionList"],
      });
    },
  });

  return { CreateSession, isPending, error };
};

export const useGetSessionList = (
  page: number = 1,
  date: string,
  search?: string,
) => {
  const input = new Date(date + " UTC");

  const formatted = input.toISOString().split("T")[0];

  const params = new URLSearchParams({
    page: page.toString(),
    filter_date: formatted,
  });
  if (search?.trim()) {
    params.append("search", search.trim());
  }
  const url = `programme/list?${params.toString()}`;

  const {
    data: SessionList,
    isPending,
    error,
  } = useQuery<GlobalAdminInfinityProgramme, AxiosError>({
    queryKey: ["sessionList", page, search, date],
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

  return { SessionList, isPending, error };
};

// export const useAdminInfiniteProgramme = (date?: string) => {
//   const {
//     data: AllProgramme,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     fetchPreviousPage,
//     isFetchingPreviousPage,
//     hasPreviousPage,
//     status,
//     error,
//   } = useInfiniteQuery<GlobalAdminInfinityProgramme, AxiosError>({
//     queryKey: ["Admin-Programme-pagination", date],
//     queryFn: async ({ pageParam }) => {
//       const input = new Date(date + " UTC");

//       const formatted = input.toISOString().split("T")[0];
//       const res = await apiRequest(
//         "get",
//         `programme/list?page=${pageParam}&filter_date=${formatted}`,
//       );
//       return res.response;
//     },
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => {
//       const { current_page, max_page, next_page } = lastPage.response;
//       if (current_page < max_page) return next_page;
//       return undefined; // no more pages
//     },
//     refetchOnWindowFocus: false,
//   });

//   return {
//     AllProgramme,
//     fetchNextPage,
//     fetchPreviousPage,
//     isFetchingPreviousPage,
//     hasNextPage,
//     hasPreviousPage,
//     isFetchingNextPage,
//     status,
//     error,
//   };
// };

export const useDeleteSession = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: DeleteSession,
    isPending,
    error,
  } = useMutation<DeleteSessionResponse, AxiosError, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await apiRequest("delete", `programme/delete/${id}`);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Session deleted successfully");
      dispatch(setIsDeleting(null));
      queryClient.invalidateQueries({
        queryKey: ["sessionList"],
      });
    },
  });

  return { DeleteSession, isPending, error };
};

export const useAddCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: AddCategory,
    isPending: isAddCategoryPending,
    error,
  } = useMutation<
    ProgrammeCreateCategoryResponse,
    AxiosError,
    {
      name: string;
      color: string;
      category_type: number;
    }
  >({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "category/add", data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Category added successfully");
      queryClient.invalidateQueries({ queryKey: ["category-list"] });
      dispatch(setCategoryModal(false));
      dispatch(exhibitorCategoryModal(false));
    },
  });

  return { AddCategory, isAddCategoryPending, error };
};

export const useDeleteCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: DeleteCategory,
    isPending: isDeleteCategoryPending,
    error,
  } = useMutation<
    ProgrammeCreateCategoryResponse,
    AxiosError,
    {
      id: string;
    }
  >({
    mutationFn: async (data) => {
      const res = await apiRequest("delete", `/category/delete/${data.id}`);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Category delete successfully");
      queryClient.invalidateQueries({ queryKey: ["category-list"] });
      dispatch(setDeletingCategory(null));
    },
  });

  return { DeleteCategory, isDeleteCategoryPending, error };
};

export const useGetCategoryAll = () => {
  const {
    data: AllCategory,
    isPending,
    error,
  } = useQuery<AllCategories_Response, AxiosError>({
    queryKey: ["category-list"],
    queryFn: async () => {
      const res = await apiRequest("get", "category/all");
      return res.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { AllCategory, isPending, error };
};

export const useEditCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isEditable } = useSelector(
    (state: RootState) => state.ExhibitorSlice,
  );
  const {
    mutate: EditCategory,
    isPending: isEditCategoryPending,
    error,
  } = useMutation<
    ProgrammeCreateCategoryResponse,
    AxiosError,
    {
      id: string;
      name: string;
      color: string;
      category_type: number;
      sequence: number;
    }
  >({
    mutationFn: async (data) => {
      const { id, ...rest } = data;
      const res = await apiRequest("post", `/category/edit/${id}`, rest);
      return res.response;
    },
    onSuccess: (_, vari) => {
      toast.success("Category edit successfully");
      queryClient.invalidateQueries({ queryKey: ["category-list"] });
      dispatch(
        setIsEditable({
          ...isEditable,
          [vari.id]: false,
        }),
      );
    },
  });

  return { EditCategory, isEditCategoryPending, error };
};

export const useEditSession = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: EditSession,
    isPending,
    error,
  } = useMutation<CreateSpeakerResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const id = data.get("id");
      const cloned = new FormData();

      for (let [key, value] of data.entries()) {
        cloned.append(key, value);
      }
      cloned.delete("bg_image");
      cloned.delete("attachment");
      const res = await apiRequest("post", `/programme/edit/${id}`, cloned);
      return res.response;
    },
    onSuccess: async (data, variable) => {
      toast.success("Session edited successfully");
      dispatch(setSelected(null));

      const file = variable.get("bg_image") as File;
      const attachment = variable.getAll("attachment") as File[];

      if (file) {
        const res = await apiRequest(
          "post",
          `/upload/presigned-url?file_name=${file.name}&module=${"programme_bg"}&ref_id=${data.response.id}`,
        );
        const { file_key, upload_url } = res.response.response;

        await axios.put(upload_url, file, {
          headers: {
            "Content-Type": file.type,
          },
          responseType: "blob",
        });

        const newForm = new FormData();
        newForm.append("module", "programme");
        newForm.append("record_id", data.response.id);
        newForm.append("file_path_image", file_key);

        await apiRequest("post", "upload/common/files", newForm);
      }

      if (attachment && attachment.length > 0) {
        await uploadWithLimit(attachment, data.response.id, [
          "programme_attachments",
          "programme",
        ]);
      }
      queryClient.invalidateQueries({
        queryKey: ["sessionList"],
      });
    },
  });

  return { EditSession, isPending, error };
};

export const useUploadSessionsCSV = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    mutate: UploadNewsCSV,
    isPending,
    error,
  } = useMutation<any, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", `/programme/upload/sessions`, data);
      return res.response;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sessions_upload_result.csv");

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("CSV downloaded successfully");
      queryClient.invalidateQueries({
        queryKey: ["Admin-Programme-pagination"],
      });
      dispatch(setUploadCSV(false));
    },
  });

  return { UploadNewsCSV, isPending, error };
};

export const useNotifyProgramme = () => {
  const { mutate, isPending } = useMutation<any, AxiosError, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await apiRequest("post", `/programme/${id}/notify`);
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
    },
  });

  return { notify: mutate, isPending };
};

export const useSessionDownload = () => {
  const { mutate: downloadSession, isPending: isdownloadPending } = useMutation(
    {
      mutationKey: ["session_download"],
      mutationFn: async () => {
        const res = await apiRequest(
          "get",
          "/programme/download",
          null,
          "blob",
        );

        const contentDisposition = res.headers["content-disposition"];
        const blob = new Blob([res.response]);

        // Extract filename safely
        let filename = "programme_list.xlsx";

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
    },
  );

  return { downloadSession, isdownloadPending };
};

export const useGetAttachment = (
  session_id: string,
  type: number = 0,
  file_id: string,
) => {
  const {
    data: Attachment,
    isPending,
    error,
  } = useQuery<string, AxiosError>({
    queryKey: ["Session_Attachment", session_id],
    queryFn: async () => {
      const res = await apiRequest(
        "get",
        `/program/attachment/${session_id}?type=${type}&file_id=${file_id}`,
        null,
        "blob",
      );
      const url = window.URL.createObjectURL(res.response);
      return url;
    },
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!session_id,
  });

  return { Attachment, isPending, error };
};
