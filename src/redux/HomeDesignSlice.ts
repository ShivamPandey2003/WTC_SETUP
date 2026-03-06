import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: HomeDesignStateType = {
  selected: null,
  news: [],
  isDeleting: null,
  isPublished: null,
  isCreating: false,
  uploadCSV: false,
  unpublish:null
};

const Home_DesignSlice = createSlice({
  name: "Home_Design",
  initialState,
  reducers: {
    setSelected: (state, payload: PayloadAction<string | null>) => {
      state.selected = payload.payload;
      return state;
    },
    setNews: (state, payload: PayloadAction<News[]>) => {
      state.news = payload.payload;
      return state;
    },
    setIsDeleting: (state, payload: PayloadAction<string | null>) => {
      state.isDeleting = payload.payload;
      return state;
    },
    setIsPublished: (state, payload: PayloadAction<string | null>) => {
      state.isPublished = payload.payload;
      return state;
    },
    setIsUnpublished: (state, payload: PayloadAction<string | null>) => {
      state.unpublish = payload.payload;
      return state;
    },
    setIsCreating: (state, payload: PayloadAction<boolean>) => {
      state.isCreating = payload.payload;
      return state;
    },
    setUploadCSV: (state, payload: PayloadAction<boolean>) => {
      state.uploadCSV = payload.payload;
      return state;
    },
  },
});

export const {
  setSelected,
  setNews,
  setIsDeleting,
  setIsPublished,
  setIsCreating,
  setUploadCSV,
  setIsUnpublished
} = Home_DesignSlice.actions;
export default Home_DesignSlice.reducer;
