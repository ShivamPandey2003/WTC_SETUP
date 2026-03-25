import type { OutputItem } from "@/lib/extra";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ProgrammeRecord = {
  start_date: string;
  start_time: string;
  end_time: string;
  end_date: string;
  data: Record<string, OutputItem[]>;
};

export type initialStateT = {
  Programmes: ProgrammeRecord;
  News: News[]
  VenueActiveTab: string
};

const initialState: initialStateT = {
  Programmes: {
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    data: {},
  },
  News:[],
  VenueActiveTab:"General Settings"
};

const ExtraSlice = createSlice({
  name: "extra_slice",
  initialState,
  reducers: {
    setProgrammes: (state, payload: PayloadAction<ProgrammeRecord>) => {
      state.Programmes = payload.payload;
    },
    setNews: (state, payload: PayloadAction<News[]>) => {
      state.News = payload.payload;
    },
    setVenueActiveTab: (state, payload: PayloadAction<string>)=>{
      state.VenueActiveTab = payload.payload
    }
  },
});

export const { setProgrammes, setNews, setVenueActiveTab } = ExtraSlice.actions;
export default ExtraSlice.reducer;
