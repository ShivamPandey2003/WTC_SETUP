import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type initialStateT = {
  selected: string | null;
  isDeleting: string | null;
  isCreating: boolean;
  categoryModal: boolean;
  Exhibitors: Exhibitor[];
  Categorys: Category[];
  open_link_new_tab: boolean;
  allow_email_exposure: boolean;
  booth_location: boolean;
  uploadCSV: boolean;
};

const initialState: initialStateT = {
  selected: null,
  isDeleting: null,
  isCreating: false,
  categoryModal: false,
  Exhibitors: [],
  Categorys: [],
  open_link_new_tab: false,
  allow_email_exposure: false,
  booth_location: false,
  uploadCSV: false
};

const Exhibitor_DesignSlice = createSlice({
  name: "Speakers_Design",
  initialState,
  reducers: {
    setSelected: (state, payload: PayloadAction<string | null>) => {
      state.selected = payload.payload;
      return state;
    },
    setIsDeleting: (state, payload: PayloadAction<string | null>) => {
      state.isDeleting = payload.payload;
      return state;
    },
    setIsCreating: (state, payload: PayloadAction<boolean>) => {
      state.isCreating = payload.payload;
      return state;
    },
    setExhibitors: (state, payload: PayloadAction<Exhibitor[]>) => {
      state.Exhibitors = payload.payload;
      return state;
    },
    setCategory: (state, payload: PayloadAction<Category[]>) => {
      state.Categorys = payload.payload;
      return state;
    },
    setOpenLinkNewTab: (state, payload: PayloadAction<boolean>) => {
      state.open_link_new_tab = payload.payload;
      return state;
    },
    setAllowEmailExposure: (state, payload: PayloadAction<boolean>) => {
      state.allow_email_exposure = payload.payload;
      return state;
    },
    setBoothLocation: (state, payload: PayloadAction<boolean>) => {
      state.booth_location = payload.payload;
      return state;
    },
    setUploadCSV: (state, payload: PayloadAction<boolean>) => {
      state.uploadCSV = payload.payload;
      return state;
    },
    setCategoryModal: (state, payload: PayloadAction<boolean>) => {
      state.categoryModal = payload.payload;
      return state;
    },
  },
});

export const {
  setSelected,
  setIsDeleting,
  setIsCreating,
  setExhibitors,
  setCategory,
  setOpenLinkNewTab,
  setAllowEmailExposure,
  setBoothLocation,
  setUploadCSV,
  setCategoryModal
} = Exhibitor_DesignSlice.actions;
export default Exhibitor_DesignSlice.reducer;
