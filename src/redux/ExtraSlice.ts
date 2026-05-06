import type { OutputItem } from "@/lib/extra";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Step = "email" | "otp";

export type ProgrammeRecord = {
  start_date: string;
  start_time: string;
  end_time: string;
  end_date: string;
  data: Record<string, OutputItem[][]>;
};

export type initialStateT = {
  email: string;
  Programmes: ProgrammeRecord;
  News: News[]
  VenueActiveTab: string
  step: Step;
};

const initialState: initialStateT = {
   email: "",
  Programmes: {
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    data: {},
  },
  News: [],
  VenueActiveTab: "General Settings",
  step: "email",
};

const ExtraSlice = createSlice({
  name: "extra_slice",
  initialState,
  reducers: {
    setEmail: (state, payload: PayloadAction<string>) => {
          state.email = payload.payload;
          return state;
        },
    setProgrammes: (state, payload: PayloadAction<ProgrammeRecord>) => {
      state.Programmes = payload.payload;
    },
    setNews: (state, payload: PayloadAction<News[]>) => {
      state.News = payload.payload;
    },
    setVenueActiveTab: (state, payload: PayloadAction<string>) => {
      state.VenueActiveTab = payload.payload
    },
    setStep: (state, payload: PayloadAction<Step>) => {
      state.step = payload.payload;
      return state;
    },
  },
});

export const { setEmail, setProgrammes, setNews, setVenueActiveTab, setStep} = ExtraSlice.actions;
export default ExtraSlice.reducer;
