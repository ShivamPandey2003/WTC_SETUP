import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type sessionType = {
  programme: Record<string, Programme[]>;
};

type initialStateType = {
  conference_title: string;
  conference_start_date: string;
  conference_end_date: string;
  conference_start_time: string;
  conference_end_time: string;
  conference_location: string;
  Session: sessionType;
  Venue: GlobalVenue;
  selectedDate: string;
  filterData: Record<string, Programme[]>;
};

const todayDate = new Date().toLocaleDateString("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const initialState: initialStateType = {
  conference_title: "",
  conference_start_date: "",
  conference_end_date: "",
  conference_start_time: "",
  conference_end_time: "",
  conference_location: "",
  Session: {
    programme: {},
  },
  Venue: {
    getting_there: {
      sub_title: "",
      description: "",
      latitude: "",
      longitude: "",
    },
    floor_plan: "",
    visa_info: {
      title: "",
      sub_title: "",
      description: "",
    },
    travel_info: {
      title: "",
      description: "",
    },
  },
  selectedDate: todayDate,
  filterData: {},
};

const Global_Slice = createSlice({
  name: "Global_Design",
  initialState,
  reducers: {
    setProgramme: (state, payload: PayloadAction<sessionType>) => {
      state.Session = payload.payload;
      state.filterData = payload.payload.programme;
      return state;
    },
    setVenue: (state, payload: PayloadAction<GlobalVenue>) => {
      state.Venue = payload.payload;
      return state;
    },
    setSelectedDate: (state, payload: PayloadAction<string>) => {
      state.selectedDate = payload.payload;
      return state;
    },
    setFilterData: (
      state,
      payload: PayloadAction<Record<string, Programme[]>>
    ) => {
      state.filterData = payload.payload;
      return state;
    },
    setConference_title:(state,
      payload: PayloadAction<ConferenceDetail>)=>{
        state.conference_start_date = payload.payload.conference_start_date
        state.conference_start_time = payload.payload.conference_start_time
        state.conference_end_time = payload.payload.conference_end_time
        state.conference_end_date = payload.payload.conference_end_date
        state.conference_location = payload.payload.conference_location
        state.conference_title = payload.payload.conference_title
      }
  },
});

export const { setProgramme, setVenue, setSelectedDate, setFilterData, setConference_title } =
  Global_Slice.actions;
export default Global_Slice.reducer;
