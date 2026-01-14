import { queryClient } from "@/provider/TanstackProvider";
import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useUploadFloorPlan = () => {
  const {
    mutate: UploadFloorPlan,
    isPending,
    error,
  } = useMutation<LogoUpdateResponse, AxiosError, { form: FormData }>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", `/floor-plan/upload`, data.form);
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
      queryClient.invalidateQueries({ queryKey: ["Floor-Plan"] });
    },
    onError: (err) => {
      toast.error(`Error updating logo: ${err.message}`);
    },
  });

  return { UploadFloorPlan, isPending, error };
};

export const useGetFloorPlan = (func: (e: string) => void) => {
  const {
    data: FloorPlan,
    isPending,
    error,
  } = useQuery<Floor_Plan_Response, AxiosError>({
    queryKey: ["Floor-Plan"],
    queryFn: async () => {
      const res = await apiRequest("get", "venue/floor-plan");
      return res.response;
    },
    select: (data) => {
      func(data.response.floor_plan);
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { FloorPlan, isPending, error };
};

export const useSaveFloorPlanData = () => {
  const navigate = useNavigate()
  const {
    mutate: SaveFloorPlanData,
    isPending,
    error,
  } = useMutation<LogoUpdateResponse, AxiosError, { floor_map_list: Shape[] }>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", `/floor-data/save`, data);
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
      navigate('/venue-design')
      // queryClient.invalidateQueries({ queryKey: ["Floor-Plan"] });
    },
    onError: (err) => {
      toast.error(`Error saving floor plan: ${err.message}`);
    },
  });

  return { SaveFloorPlanData, isPending, error };
};

export const useGetAdminFloorPlanV2 = () => {
  const {
    data: FloorPlan,
    isPending,
    error,
  } = useQuery<Global_Floor_Plan_Response, AxiosError>({
    queryKey: ["Admin_FloorPlan"],
    queryFn: async () => {
      const res = await apiRequest("get", "map-lists");
      return res.response;
    },
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    FloorPlan,
    isPending,
    error,
  };
};