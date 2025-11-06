import { setAppConfig } from "@/redux/GlobalDesignSlice";
import { setProgramme, setVenue } from "@/redux/GlobalSlice";
import type { AppDispatch } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDispatch } from "react-redux";

export const useGlobalDesign = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: GlobalDesign,
    isPending: isGlobalDesignPending,
    error,
  } = useQuery<GlobalDesignResponse, AxiosError>({
    queryKey: ["global-design"],
    queryFn: async () => {
      const res = await apiRequest("get", "global/general");
      return res.response;
    },
    select: (data) => {
      dispatch(setAppConfig(data.response));
      return data;
    },
    refetchOnWindowFocus: false,
    retry:1
  });

  return { GlobalDesign, isGlobalDesignPending, error };
};

export const useGetNewsList = () => {
  const {
    data: NewsList,
    isPending,
    error,
  } = useQuery<NewsListResponse, AxiosError>({
    queryKey: ["global-News"],
    queryFn: async () => {
      const res = await apiRequest("get", "news/general");
      return res.response;
    },
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
    retry:1
  });

  return { NewsList, isPending, error };
};

export const useGetSpeakersList = ()=>{
  const {
    data: SpeakersList,
    isPending,
    error,
  } = useQuery<GlobalSpeakerListResponse, AxiosError>({
    queryKey: ["global-speaker"],
    queryFn: async () => {
      const res = await apiRequest("get", "speaker/list");
      return res.response;
    },
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
    retry:1
  });

  return { SpeakersList, isPending, error };
};

export const useGetProgrammeList = ()=>{
  const dispatch = useDispatch<AppDispatch>()
  const {
    data: ProgrammeList,
    isPending,
    error,
  } = useQuery<GlobalProgrammeListResponse, AxiosError>({
    queryKey: ["global-programme"],
    queryFn: async () => {
      const res = await apiRequest("get", "program/lists");
      return res.response;
    },
    select: (data) => {
      dispatch(setProgramme(data.response.programme))
      return data;
    },
    refetchOnWindowFocus: false,
    retry:1
  });

  return { ProgrammeList, isPending, error };
};

export const useGetNavMenu = ()=>{
  const {
    data: NavMenu,
    isPending,
    error,
  } = useQuery<GlobalNavMenuResponse, AxiosError>({
    queryKey: ["global-NavMenu"],
    queryFn: async () => {
      const res = await apiRequest("get", "speaker/list");
      return res.response;
    },
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
    retry:1
  });

  return { NavMenu, isPending, error };
};

export const useGetVenue = ()=>{
  const dispatch= useDispatch<AppDispatch>()
  const {
    data: Venue,
    isPending,
    error,
  } = useQuery<GlobalVenueResponse, AxiosError>({
    queryKey: ["global-venue"],
    queryFn: async () => {
      const res = await apiRequest("get", "venue");
      return res.response;
    },
    select: (data) => {
      dispatch(setVenue(data.response))
      return data;
    },
    refetchOnWindowFocus: false,
    retry:1
  });

  return { Venue, isPending, error };
};