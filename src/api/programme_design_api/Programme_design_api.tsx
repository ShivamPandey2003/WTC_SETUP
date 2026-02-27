import { queryClient } from "@/provider/TanstackProvider";
import { setDeletingCategory, setIsEditable } from "@/redux/ExhibitorSlice";
import {
  setCategoryModal,
  setIsCreating,
  setIsDeleting,
  setSelected,
  setSession,
  setUploadCSV,
} from "@/redux/ProgrammeDesignSlice";
import { setCategoryModal as exhibitorCategoryModal } from "@/redux/ExhibitorSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const useCreateSession = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: CreateSession,
    isPending,
    error,
  } = useMutation<CreateSessionResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "programme/create", data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Session created successfully");
      dispatch(setIsCreating(false));
      queryClient.invalidateQueries({ queryKey: ["sessionList"] });
    },
    onError: (err) => {
      toast.error(`Error creating session: ${err.message}`);
    },
  });

  return { CreateSession, isPending, error };
};

export const useGetSessionList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: SessionList,
    isPending,
    error,
  } = useQuery<SessionListResponse, AxiosError>({
    queryKey: ["sessionList"],
    queryFn: async () => {
      const res = await apiRequest("get", "programme/list");
      return res.response;
    },
    select: (data) => {
      dispatch(setSession(data.response));
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { SessionList, isPending, error };
};

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
      queryClient.invalidateQueries({ queryKey: ["sessionList"] });
    },
    onError: (err) => {
      toast.error(`Error deleting session: ${err.message}`);
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
    onError: (err) => {
      toast.error(`Error adding category: ${err.message}`);
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
    onError: (err) => {
      toast.error(`Error deleting category: ${err.message}`);
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
    onError: (err) => {
      toast.error(`Error editing category: ${err.message}`);
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
      const res = await apiRequest("post", `/programme/edit/${id}`, data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Session edited successfully");
      queryClient.invalidateQueries({ queryKey: ["sessionList"] });
      dispatch(setSelected(null));
    },
    onError: (err) => {
      toast.error(`Error editing session: ${err.message}`);
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
  } = useMutation<LogoUpdateResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", `/programme/upload/sessions`, data);
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
      queryClient.invalidateQueries({ queryKey: ["sessionList"] });
      dispatch(setUploadCSV(false));
    },
    onError: (err) => {
      toast.error(`Error updating logo: ${err.message}`);
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
    onError: (err) => {
      toast.error(`Error sending notification: ${err.message}`);
    },
  });

  return { notify: mutate, isPending };
};

export const useSessionDownload = () => {
  const { mutate: downloadSession, isPending: isdownloadPending } = useMutation({
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
      let filename = "programme_list.csv";

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

  return { downloadSession, isdownloadPending };
};