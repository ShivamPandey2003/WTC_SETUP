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
};

const initialState: initialStateT = {
  Programmes: {
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    data: {},
  },
};

const ExtraSlice = createSlice({
  name: "extra_slice",
  initialState,
  reducers: {
    setProgrammes: (state, payload: PayloadAction<ProgrammeRecord>) => {
      state.Programmes = payload.payload;
    },
  },
});

export const { setProgrammes } = ExtraSlice.actions;
export default ExtraSlice.reducer;
