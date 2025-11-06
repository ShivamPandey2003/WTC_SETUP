import { queryClient } from "@/provider/TanstackProvider";
import { setIsCreating, setIsDeleting } from "@/redux/ProgrammeDesignSlice";
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
      return res.data;
    },
    onSuccess: () => {
      toast.success("Session created successfully");
      dispatch(setIsCreating(false));
      queryClient.invalidateQueries({ queryKey: ["sessionList"] });
    },
    onError: (err) => {
      toast.error(`Error creating session: ${err.message}`);
      // console.log(Variable);
    },
  });

  return { CreateSession, isPending, error };
};

export const useGetSessionList = () => {
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
      return data;
    },
    refetchOnWindowFocus: false,
    retry:1
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
      return res.data;
    },
    onSuccess: () => {
      toast.success("Session deleted successfully");
      dispatch(setIsDeleting(null));
      queryClient.invalidateQueries({ queryKey: ["sessionList"] });
    },
    onError: (err) => {
      toast.error(`Error deleting session: ${err.message}`);
      // console.log(Variable);
    },
  });

  return { DeleteSession, isPending, error };
};
