import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type OTP = [string, string, string, string, string, string];

type initialStateType = {
  email: string;
  otp: OTP;
  resendCount: number;
  resendCooldownEnd: number;
  userinfo: {
    firstname: string;
    lastname: string;
    grp: number;
    is_verified: number;
  };
};

const initialState: initialStateType = {
  email: "",
  otp: ["", "", "", "", "", ""],
  resendCount: 0,
  resendCooldownEnd: 0,
  userinfo: {
    firstname: "",
    lastname: "",
    grp: 0,
    is_verified: 0,
  },
};

const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    setEmail: (state, payload: PayloadAction<string>) => {
      state.email = payload.payload;
      return state;
    },
    setOtp: (state, payload: PayloadAction<OTP>) => {
      state.otp = payload.payload;
      return state;
    },
    setResendCooldown: (state, action) => {
      state.resendCooldownEnd = action.payload;
    },
    increaseResendCount: (state) => {
      state.resendCount += 1;
    },
    resetResendState: (state) => {
      state.resendCount = 0;
      state.resendCooldownEnd = 0;
    },
    setUserInfo: (
      state,
      payload: PayloadAction<{
        firstname: string;
        lastname: string;
        grp: number;
        is_verified: number;
      }>,
    ) => {
      state.userinfo = payload.payload;
    },
  },
});

export const {
  setEmail,
  setOtp,
  setResendCooldown,
  increaseResendCount,
  resetResendState,
  setUserInfo,
} = AuthSlice.actions;
export default AuthSlice.reducer;
