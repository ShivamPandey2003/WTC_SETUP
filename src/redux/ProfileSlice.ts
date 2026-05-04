import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ProfileT = {
  user_info: {
    firstname: string;
    lastname: string;
    email: string;
    designation: string | null;
    company_name: string | null;
    linkedin_url: string | null;
    phone_number: string | null;
    profile_image: string | null;
    gender: "Male" | "Female" | "Other" | string
    image_id: string;
  };
  qr_image: string;
  speaker_info: {
    "firstname": string,
    "lastname": string,
    "designation": string,
    "company": string,
    "bio": string,
    "profile_image": string,
    "external_link": string,
    "linkedin_url": string,
    "whatsapp_url": string
  } | null
  exhibitor_info: {
    "full_name": string,
    "url": string,
    "logo": string,
    "booth_no": string
  } | null
};

const initialState: ProfileT = {
  user_info: {
    firstname: "",
    lastname: "",
    email: "",
    designation: "",
    company_name: "",
    linkedin_url: "",
    phone_number: "",
    profile_image: "",
    gender: "",
    image_id: ""
  },
  qr_image: "",
  speaker_info:null,
  exhibitor_info: null
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, payload: PayloadAction<ProfileT>) => {
      state = payload.payload;
      return state;
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
