import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ProgrammeDesignStateType = Omit<
  HomeDesignStateType,
  "isPublished" | "news"
> & {
  speakers: (CreateSpeakerRequestT & {
    speaker_id: string;
    created_on: string;
  })[];
  SpeakerSettings: SpeakerSetting;
};

const initialState: ProgrammeDesignStateType = {
  selected: null,
  speakers: [],
  isDeleting: null,
  isCreating: false,
  SpeakerSettings: {
    carusole_display:[],
    conference_title: "",
    conference_start_date: "",
    conference_end_date: "",
    conference_start_time: "",
    conference_end_time: "",
    conference_location: "",
    speaker_info: {
      show_speaker_fullname: false,
      show_short_name: false,
      show_linkedin_badge: false,
      show_no_of_sessions: false,
      show_bio: false,
      exhibitors_setting: false,
      show_home_title: false,
      show_carusole: false,
    },
    category_filter: false,
    category_labels: [],
    exhibitor_settings: {
      exhibitors_category_list: [],
      open_link_new_tab: false,
      allow_email_exposure: false,
      booth_location: false,
    },
  },
};

const Speakers_DesignSlice = createSlice({
  name: "Speakers_Design",
  initialState,
  reducers: {
    setSelected: (state, payload: PayloadAction<string | null>) => {
      state.selected = payload.payload;
      return state;
    },
    setSpeaker: (
      state,
      payload: PayloadAction<
        (CreateSpeakerRequestT & { speaker_id: string; created_on: string })[]
      >
    ) => {
      state.speakers = payload.payload;
      return state;
    },
    setIsDeleting: (state, payload: PayloadAction<string | null>) => {
      state.isDeleting = payload.payload;
      return state;
    },
    setIsCreating: (state, payload: PayloadAction<boolean>) => {
      state.isCreating = payload.payload;
      return state;
    },
    setSpeakerSettings: (state, payload: PayloadAction<SpeakerSetting>) => {
      state.SpeakerSettings = payload.payload;
      return state;
    },
  },
});

export const {
  setSelected,
  setSpeaker,
  setIsDeleting,
  setIsCreating,
  setSpeakerSettings,
} = Speakers_DesignSlice.actions;
export default Speakers_DesignSlice.reducer;
