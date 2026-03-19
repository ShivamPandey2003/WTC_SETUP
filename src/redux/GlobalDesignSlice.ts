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
    show_splash: true,
    show_exhibitor_splash: true,
    logo: {
      url: "",
      name: "",
      logo_img: "",
    },
    splash: {
      image: "",
      title: "",
      subtitle: "",
    },
    exhibitor_splash: {
      image: "",
      title: "",
      subtitle: "",
    },
    sponsors: {
      logo: "",
    },
    home_design: {
      home_title: "",
      categories:[],
      key_note_speaker:false,
      show_carusole:false
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

export const { setAppConfig } = Global_DesignSlice.actions;
export default Global_DesignSlice.reducer;
