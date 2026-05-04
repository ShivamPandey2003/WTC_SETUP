import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type OTP = [string, string, string, string, string, string];

type initialStateType = {
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
  setOtp,
  setResendCooldown,
  increaseResendCount,
  resetResendState,
  setUserInfo,
} = AuthSlice.actions;
export default AuthSlice.reducer;
