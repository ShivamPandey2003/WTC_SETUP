import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { queryClient } from "@/provider/TanstackProvider";
import { toast } from "sonner";
import {
  setExhibitors,
  setIsCreating,
  setIsDeleting,
  setSelected,
  setUploadCSV,
} from "@/redux/ExhibitorSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";

export const useGetExhibitorsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: Exhibitors,
    isPending: isExhibitorsPending,
    error: errorInError,
  } = useQuery<ExhibitorListResponse, AxiosError>({
    queryKey: ["exhibitor-design-list"],
    queryFn: async () => {
      const res = await apiRequest("get", "exhibitors/listing");
      return res.response;
    },
    select: (data) => {
      dispatch(
        setExhibitors(
          data.response.seq.flatMap((string) => [...data.response[string]])
        )
      );
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { Exhibitors, isExhibitorsPending, errorInError };
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
      queryClient.invalidateQueries({ queryKey: ["exhibitor-design-list"] });
    },
    onError: (err) => {
      toast.error(`Error creating exhibitor: ${err.message}`);
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
      queryClient.invalidateQueries({ queryKey: ["exhibitor-design-list"] });
    },
    onError: (err) => {
      toast.error(`Error deleting exhibitor: ${err.message}`);
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
    {form:FormData, id: string }
  >({
    mutationFn: async (data) => {
      const { id, form } = data;
      const res = await apiRequest("post", `exhibitors/edit/${id}`, form);
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
      dispatch(setSelected(null));
      queryClient.invalidateQueries({ queryKey: ["exhibitor-design-list"] });
    },
    onError: (err) => {
      toast.error(`Error edit exhibitor: ${err.message}`);
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
  } = useMutation<LogoUpdateResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", `/news/upload/news_list`, data);
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
      queryClient.invalidateQueries({ queryKey: ["exhibitor-design-list"] });
      dispatch(setUploadCSV(false));
    },
    onError: (err) => {
      toast.error(`Error updating logo: ${err.message}`);
    },
  });

  return { UploadExhibitorsCSV, isPending, error };
};