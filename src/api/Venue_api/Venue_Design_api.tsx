import { queryClient } from "@/provider/TanstackProvider";
import type { AppDispatch } from "@/redux/store";
import {
  setEditFloorLevelModal,
  setFloorLevelModal,
  setGlobalMap,
  setMap,
} from "@/redux/venueDesignV2Slice";
import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDispatch } from "react-redux";
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
    }
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
  const navigate = useNavigate();
  const {
    mutate: SaveFloorPlanData,
    isPending,
    error,
  } = useMutation<
    LogoUpdateResponse,
    AxiosError,
    { id: string; floor_map_list: Shape[] }
  >({
    mutationFn: async (data) => {
      const res = await apiRequest("post", `/designer/floor-data/save`, data);
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
      navigate("/venue-design");
      // queryClient.invalidateQueries({ queryKey: ["Floor-Plan"] });
    }
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

// export const useGetFloorMapList = () => {
//   const dispatch = useDispatch<AppDispatch>()
//   const {data:FloorMapList, isPending:isFloorMapListPending, error:FloorMapListError} = useQuery<Global_Floor_Plan_Response, AxiosError>({
//     queryKey: ["map-list"],
//     queryFn: async () => {
//       const res = await apiRequest("get", "/map-lists");
//       return res.response;
//     },
//     select:(data)=>{
//       dispatch(setShapes(data.response.floor_map_list))
//       return data
//     },
//     refetchOnWindowFocus: false,
//     retry: 1,
//   });

//   return {FloorMapList, isFloorMapListPending, FloorMapListError}
// };

export const useV2GetFloorMApList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: V2_FloorMapList,
    isPending: V2_isFloorMapListPending,
    error: V2_FloorMapListError,
  } = useQuery<VenueDesignMap, AxiosError>({
    queryKey: ["map-list_V2"],
    queryFn: async () => {
      const res = await apiRequest("get", "/designer/listing");
      return res.response;
    },
    select: (data) => {
      dispatch(setMap(data.response));
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { V2_FloorMapList, V2_isFloorMapListPending, V2_FloorMapListError };
};

export const useCreateFloorLevel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: CreateFloorLevel,
    isPending,
    error,
  } = useMutation<any, AxiosError, FormData>({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "/designer/save", data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Floor Level created successfully");
      queryClient.invalidateQueries({ queryKey: ["map-list_V2"] });
      dispatch(setFloorLevelModal(false));
    }
  });

  return { CreateFloorLevel, isPending, error };
};

export const useDeleteFloorLevel = () => {
  const {
    mutate: DeleteFloorLevel,
    isPending,
    error,
  } = useMutation<any, AxiosError, { id: string }>({
    mutationFn: async (data) => {
      const res = await apiRequest("delete", `/designer/${data.id}`, data);
      return res.response;
    },
    onSuccess: () => {
      toast.success("Floor Level delete successfully");
      queryClient.invalidateQueries({ queryKey: ["map-list_V2"] });
    }
  });

  return { DeleteFloorLevel, isPending, error };
};

export const useEditFloorLevel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: EditFloorLevel,
    isPending,
    error,
  } = useMutation<any, AxiosError, { id: string; data: FormData }>({
    mutationFn: async (data) => {
      const res = await apiRequest(
        "post",
        `/designer/edit/${data.id}`,
        data.data,
      );
      return res.response;
    },
    onSuccess: () => {
      toast.success("Floor Level Edit successfully");
      queryClient.invalidateQueries({ queryKey: ["map-list_V2"] });
      dispatch(setEditFloorLevelModal(false));
    }
  });

  return { EditFloorLevel, isPending, error };
};

export const useGlobalV2GetFloorMapList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: V2_Global_FloorMapList,
    isPending: V2_Global_isFloorMapListPending,
    error: V2_Global_FloorMapListError,
  } = useQuery<GlobalVenueDesignMap, AxiosError>({
    queryKey: ["Global_map-list_V2"],
    queryFn: async () => {
      const res = await apiRequest("get", "/designer/list");
      return res.response;
    },
    select: (data) => {
      dispatch(setGlobalMap(data.response));
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    V2_Global_FloorMapList,
    V2_Global_isFloorMapListPending,
    V2_Global_FloorMapListError,
  };
};
