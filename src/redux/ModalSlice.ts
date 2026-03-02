import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: ModelSliceType = {
  loginModel: false,
  searchModal: false,
  title: null,
  register: false,
};

const ModelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setLoginModel: (state, payload: PayloadAction<boolean>) => {
      state.loginModel = payload.payload;
      return state;
    },
    setResgister: (state, payload: PayloadAction<boolean>) => {
      state.register = payload.payload;
      return state;
    },
    setSearchModal: (state, payload: PayloadAction<boolean>) => {
      state.searchModal = payload.payload;
    },
    setTitle: (state, payload: PayloadAction<string | null>) => {
      state.title = payload.payload;
    },
  },
});

export const { setLoginModel, setSearchModal, setTitle, setResgister } = ModelSlice.actions;
export default ModelSlice.reducer;
