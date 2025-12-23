import { queryClient } from "@/provider/TanstackProvider";
import {
  setCategoryModal,
  setIsCreating,
  setIsDeleting,
  setSelected,
  setSession,
} from "@/redux/ProgrammeDesignSlice";
import type { AppDispatch } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDispatch } from "react-redux";
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
  const dispatch = useDispatch<AppDispatch>()
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
      dispatch(setSession(data.response))
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
      const res = await apiRequest("delete", `/category/delete/${data}`);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Category delete successfully");
      queryClient.invalidateQueries({ queryKey: ["Settings"] });
      dispatch(setCategoryModal(false));
    },
    onError: (err) => {
      toast.error(`Error deleting category: ${err.message}`);
    },
  });

  return {DeleteCategory, isDeleteCategoryPending, error}
};

export const useGetCategoryAll = ()=>{
  const {data:AllCategory, isPending, error} = useQuery({
    queryKey:['category-list'],
    queryFn:async()=>{
       const res = await apiRequest("get", "category/all");
      return res.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  })

  return {AllCategory, isPending, error}
}

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
