import {
  getDateRange,
  getEarliestAndLatest,
  transformSessions,
} from "@/lib/extra";
import { CustomPick } from "@/lib/utils";
import { queryClient } from "@/provider/TanstackProvider";
import { setAppConfig } from "@/redux/GlobalDesignSlice";
import {
  setArrayTabs,
  setConference_title,
  setProgramme,
  setVenue,
} from "@/redux/GlobalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import {
  setNews,
  setProgrammes,
  type ProgrammeRecord,
} from "@/redux/ExtraSlice";

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
    retry: 1,
  });

  return { GlobalDesign, isGlobalDesignPending, error };
};

export const useGetNewsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: NewsList,
    isPending,
    error,
    refetch,
  } = useQuery<NewsListResponse, AxiosError>({
    queryKey: ["global-News"],
    queryFn: async () => {
      const res = await apiRequest("get", "news/list");
      return res.response;
    },
    select: (data) => {
      dispatch(setNews(data.response));
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { NewsList, isPending, error, refetch };
};

export const useInfiniteNews = () => {
  const {
    data: AllNews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<GlobalInfinityNews, AxiosError>({
    queryKey: ["News-pagination"],
    queryFn: async ({ pageParam }) => {
      const res = await apiRequest("get", `news/general?page=${pageParam}`);
      return res.response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, max_page, next_page } = lastPage.response;
      if (current_page < max_page) return next_page;
      return undefined; // no more pages
    },
  });

  return {
    AllNews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  };
};

export const useGetSpeakersList = () => {
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
    retry: 1,
  });

  return { SpeakersList, isPending, error };
};

export const useInfiniteSpeakers = () => {
  const {
    data: AllSpeakers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<GlobalInfinitySpeakers, AxiosError>({
    queryKey: ["Speakers-pagination"],
    queryFn: async ({ pageParam }) => {
      const res = await apiRequest("get", `speaker/list?page=${pageParam}`);
      return res.response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, max_page, next_page } = lastPage.response;
      if (current_page < max_page) return next_page;
      return undefined; // no more pages
    },
  });

  return {
    AllSpeakers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  };
};

export const useGetProgrammeList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: ProgrammeList,
    isPending,
    error,
    refetch,
  } = useQuery<GlobalProgrammeListResponse, AxiosError>({
    queryKey: ["global-programme"],
    queryFn: async () => {
      const res = await apiRequest("get", "program/list2");
      return res.response;
    },
    select: (data) => {
      const value: ProgrammeRecord = {
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        data: {},
      };

      const parseDate = (dateStr: string): Date => {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d); // Safe, no timezone issues
      };

      const formatYMD = (date: Date): string => {
        return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
      };

      const dates = data.response.programme.map((item) =>
        parseDate(item.start_date),
      );

      const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
      const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
      const Time = getEarliestAndLatest(data.response.programme);

      value.start_date = formatYMD(earliest);
      value.end_date = formatYMD(latest);
      value.start_time = Time.earliest;
      value.end_time = Time.latest;

      const dateRange = getDateRange(value.start_date, value.end_date);
      dateRange.forEach((item) => {
        const val = data.response.programme
          .filter((e) => e.start_date === item)
          .map((Datas) => {
            const detail = Object.entries(Datas.categories).map(
              ([key, set]) => {
                return {
                  id: key,
                  name: set.name,
                  color: set.color,
                };
              },
            );
            return {
              session_id: Datas.id,
              id: nanoid(),
              categoryId: detail[0].id,
              title: detail[0]?.name,
              color: detail[0]?.color,
              start_time: Datas.start_time,
              end_time: Datas.end_time,
              type: "normal",
            };
          });
        value.data = {
          [item]: transformSessions(val as any),
          ...value.data,
        };
      });
      dispatch(setProgrammes(value));
      dispatch(setProgramme(data.response.programme));

      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { ProgrammeList, isPending, error, refetch };
};

export const useGetNavMenu = () => {
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
    retry: 1,
  });

  return { NavMenu, isPending, error };
};

export const useGetVenue = () => {
  const dispatch = useDispatch<AppDispatch>();
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
      dispatch(setVenue(data.response));
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { Venue, isPending, error };
};

export const useAppConfigUpdate = () => {
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice,
  );

  const cleanData = {
    ...appConfig,
    logo: (({ url, logo_img, ...rest }) => rest)(appConfig.logo),
  };

  const NewData = CustomPick(cleanData.text_style, [
    "all_other_text",
    "heading_1",
    "heading_2",
    "heading_3",
  ]);

  const {
    mutate: updateAppConfig,
    isPending: isUpdateAppConfigPending,
    error: errorInUpdateAppConfig,
  } = useMutation<ProfilePicResponse, AxiosError>({
    mutationFn: async () => {
      const res = await apiRequest("post", "global/settings/update", {
        ...cleanData,
        text_style: NewData,
      });
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
      queryClient.invalidateQueries({ queryKey: ["global-design"] });
    },
  });
  return { updateAppConfig, isUpdateAppConfigPending, errorInUpdateAppConfig };
};

export const useUploadLogo = () => {
  const {
    mutate: UploadLogo,
    isPending,
    error,
  } = useMutation<
    LogoUpdateResponse,
    AxiosError,
    { form: FormData; type: number; extra?: string }
  >({
    mutationFn: async (data) => {
      const params = data.extra ? `${data.type}${data.extra}` : data.type;
      const res = await apiRequest(
        "post",
        `global/settings/logo/update?main=${params}`,
        data.form,
      );
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
    },
  });

  return { UploadLogo, isPending, error };
};

export const useSpeakerDesignUpdate = () => {
  const { SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const filtered = CustomPick(SpeakerSettings, ["speaker_info", "speaker_tab"]);

  const {
    mutate: UpdateSpeakerDesign,
    isPending: isUpdateSpeakerDesignPending,
    error: errorInUpdateSpeakerDesign,
  } = useMutation<ProfilePicResponse, AxiosError>({
    mutationFn: async () => {
      const res = await apiRequest("post", "speaker/settings/save", {
        speaker_tab: filtered.speaker_tab,
        ...filtered.speaker_info,
      });
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
    },
  });

  return {
    UpdateSpeakerDesign,
    isUpdateSpeakerDesignPending,
    errorInUpdateSpeakerDesign,
  };
};

export const useVenueDesignUpdate = () => {
  const { SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const { venue_tab, venue } = CustomPick(SpeakerSettings, [
    "venue_tab",
    "venue",
  ]);

  const { image, ...rest } = venue;

  const data =
    typeof image === "string"
      ? {
          ...rest,
          venue_tab,
          floor_plan: "",
          visa_title: "",
          visa_sub_title: "",
          visa_description: "",
          travel_title: "",
          travel_description: "",
        }
      : {
          ...venue,
          venue_tab,
          floor_plan: "",
          visa_title: "",
          visa_sub_title: "",
          visa_description: "",
          travel_title: "",
          travel_description: "",
        };

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const {
    mutate: UpdateVenueDesign,
    isPending: isUpdateVenueDesignPending,
    error: errorInUpdateVenueDesign,
  } = useMutation<ProfilePicResponse, AxiosError>({
    mutationFn: async () => {
      const res = await apiRequest("post", "/venue/save", formData);
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
    },
  });

  return {
    UpdateVenueDesign,
    isUpdateVenueDesignPending,
    errorInUpdateVenueDesign,
  };
};

export const useProgrameDesignUpdate = () => {
  const { SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const filtered = CustomPick(SpeakerSettings, [
    "conference_title",
    "conference_start_date",
    "conference_end_date",
    "conference_start_time",
    "conference_end_time",
    "conference_location",
    "category_filter",
    "category_labels",
    "programme_tab",
    "pdf_end_date",
    "pdf_start_date",
  ]);

  const {
    mutate: UpdateProgrammeDesign,
    isPending: isUpdateProgrammeDesignPending,
    error: errorInUpdateProgrammeDesign,
  } = useMutation<ProfilePicResponse, AxiosError>({
    mutationFn: async () => {
      const lables = filtered.category_labels.map((item) => item);
      const value = { ...filtered, category_labels: lables };
      const res = await apiRequest("post", "general/programme/save", value);
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
    },
  });

  return {
    UpdateProgrammeDesign,
    isUpdateProgrammeDesignPending,
    errorInUpdateProgrammeDesign,
  };
};

export const useCategoryList = () => {
  const { data: Category, isPending: isCategoryPending } = useQuery<
    CategoryListResponse,
    AxiosError
  >({
    queryKey: ["category-list"],
    queryFn: async () => {
      const res = await apiRequest("get", "category/all");
      return res.response;
    },
    select: (data) => {
      return data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
  return { Category, isCategoryPending };
};

export const useGeneralExhibitorsUpdate = () => {
  const { Categorys } = useSelector((state: RootState) => state.ExhibitorSlice);
  const { SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const exhibitors_category_list = Categorys.map((item) => item.id);
  const Body = {
    exhibitors_category_list,
    open_link_new_tab: SpeakerSettings.exhibitor_settings.open_link_new_tab,
    allow_email_exposure:
      SpeakerSettings.exhibitor_settings.allow_email_exposure,
    booth_location: SpeakerSettings.exhibitor_settings.booth_location,
    exhibitors_tab: SpeakerSettings.exhibitors_tab,
  };
  const {
    mutate: GeneralExhibitorsUpdate,
    isPending: isGeneralExhibitorsUpdatePending,
    error,
  } = useMutation<ProfilePicResponse, AxiosError>({
    mutationFn: async () => {
      const res = await apiRequest("post", "general/exhibitors/save", Body);
      return res.response;
    },
    onSuccess: (data) => {
      toast.success(data.header.message);
    },
  });

  return { GeneralExhibitorsUpdate, isGeneralExhibitorsUpdatePending, error };
};

export const useGetExhibitorsList = () => {
  const {
    data: ExhibitorList,
    isPending,
    error,
  } = useQuery<GlobalExhibitorListResponse, AxiosError>({
    queryKey: ["global-Exhibitors"],
    queryFn: async () => {
      const res = await apiRequest("get", "exhibitors/carusole");
      return res.response;
    },
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { ExhibitorList, isPending, error };
};

export const useInfiniteExhibitors = () => {
  const {
    data: AllExhibitors,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<GlobalInfinityExhibitors, AxiosError>({
    queryKey: ["Exhibitors-pagination"],
    queryFn: async ({ pageParam }) => {
      const res = await apiRequest("get", `exhibitors/list?page=${pageParam}`);
      return res.response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, max_page, next_page } = lastPage.response;
      if (current_page < max_page) return next_page;
      return undefined; // no more pages
    },
  });

  return {
    AllExhibitors,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  };
};

export const useGetUsersProfile = (id: string) => {
  const {
    data: UsersProfile,
    isPending,
    error,
  } = useQuery<GlobalUsersProfile, AxiosError>({
    queryKey: ["users-profile"],
    queryFn: async () => {
      const res = await apiRequest("get", `profile/view?ID=${id}`);
      return res.response;
    },
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { UsersProfile, isPending, error };
};

export const useGetConferenceDetails = () => {
  const dipatch = useDispatch<AppDispatch>();
  const {
    data: ConferenceDetails,
    isPending,
    error,
  } = useQuery<ConferenceDetailResponse, AxiosError>({
    queryKey: ["Conference-Details"],
    queryFn: async () => {
      const res = await apiRequest("get", "conference/details");
      return res.response;
    },
    select: (data) => {
      dipatch(setConference_title(data.response));
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { ConferenceDetails, isPending, error };
};

export const useHomeDesignUpdate = () => {
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice,
  );
  const filtered = CustomPick(appConfig, ["home_design"]);

  const {
    mutate: UpdateHomeDesign,
    isPending: isUpdateHomeDesignPending,
    error: errorInUpdateHomeDesign,
  } = useMutation<ProfilePicResponse, AxiosError>({
    mutationFn: async () => {
      const res = await apiRequest(
        "post",
        "/home/design/save",
        filtered.home_design,
      );
      return res.response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["global-design"] });
      toast.success(data.header.message);
    },
  });

  return {
    UpdateHomeDesign,
    isUpdateHomeDesignPending,
    errorInUpdateHomeDesign,
  };
};

export const useGetProgrammeList2 = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: ProgrammeList,
    isPending,
    error,
  } = useQuery<Record<string, any>, AxiosError>({
    queryKey: ["global-programme"],
    queryFn: async () => {
      const res = await apiRequest("get", "program/lists");
      return res.response;
    },
    select: (data) => {
      dispatch(setProgramme(data.response.programme));
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { ProgrammeList, isPending, error };
};

export const useGetFloorPlanV2 = () => {
  const {
    data: FloorPlan,
    isPending,
    error,
  } = useQuery<Global_Floor_Plan_Response, AxiosError>({
    queryKey: ["global_FloorPlan"],
    queryFn: async () => {
      const res = await apiRequest("get", "floor-plan");
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

export const useGetTabs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: tabsData,
    isPending,
    error,
  } = useQuery<TabsResponse, AxiosError>({
    queryKey: ["global_Tab"],
    queryFn: async () => {
      const res = await apiRequest("get", "tabs");
      return res.response;
    },
    select: (data) => {
      dispatch(setArrayTabs(data.response));
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    tabsData,
    isPending,
    error,
  };
};

export const useInfiniteSearch = ({
  search,
  route,
}: { search?: string; route?: string } = {}) => {
  const {
    data: AllNews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<any, AxiosError>({
    queryKey: [search, route],
    queryFn: async ({ pageParam }) => {
      const params = search
        ? `page=${pageParam}&search=${search}`
        : `page=${pageParam}`;
      let endpoint: string = "";
      switch (route) {
        case "/":
          endpoint = `news/general?${params}`;
          break;
        case "/speaker":
          endpoint = `speaker/list?${params}`;
          break;
        case "/exhibitors":
          endpoint = `exhibitors/list?${params}`;
          break;
        case route?.includes("news"):
          endpoint = `news/general?${params}`;
          break;
      }
      const res = await apiRequest("get", endpoint);
      return res.response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, max_page, next_page } = lastPage.response;
      if (current_page < max_page) return next_page;
      return undefined; // no more pages
    },
    retry: 1,
  });

  return {
    AllNews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  };
};
