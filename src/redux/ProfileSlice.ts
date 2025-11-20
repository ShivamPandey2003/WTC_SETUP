import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ProfileT = {
  user_info: {
    firstname: string;
    lastname: string;
    email: string;
    designation: string;
    company_name: string;
    linkedin_url: string;
    phone_number: string;
    profile_image: string;
  };
  qr_image: string;
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
  },
  qr_image: "",
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
