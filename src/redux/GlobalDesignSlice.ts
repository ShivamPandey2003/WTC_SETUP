import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
  appConfig: AppConfig;
};

const initialState: initialStateType = {
  appConfig: {
    id: 0,
    text_style: {
      heading_1: "",
      heading_2: "",
      heading_3: "",
      all_other_text: "",
      font_family: "",
    },
    color_schema: {
      primary_color: "",
      secondary_color: "",
    },
    logo: {
      url: "",
      name: "",
    },
  },
};

const Global_DesignSlice = createSlice({
  name: "Global_Design",
  initialState,
  reducers: {
    setAppConfig: (state, payload: PayloadAction<AppConfig>) => {
      state.appConfig = payload.payload;
    },
  },
});

export const {setAppConfig} = Global_DesignSlice.actions;
export default Global_DesignSlice.reducer;
