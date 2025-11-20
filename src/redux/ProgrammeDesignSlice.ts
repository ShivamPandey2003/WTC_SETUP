import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ProgrammeDesignStateType = Omit<
  HomeDesignStateType,
  "selected" | "isPublished" | "news"
> & { session: Session[], categoryModal:boolean,  selected: string | null; };

const initialState: ProgrammeDesignStateType = {
  session: [],
  selected: null,
  isDeleting: null,
  isCreating: false,
  categoryModal: false
};

const Programme_DesignSlice = createSlice({
  name: "Home_Design",
  initialState,
  reducers: {
    setIsDeleting: (state, payload: PayloadAction<string | null>) => {
      state.isDeleting = payload.payload;
      return state;
    },
    setIsCreating:(state, payload: PayloadAction<boolean>)=>{
        state.isCreating = payload.payload
        return state;
    },
    setCategoryModal:(state, payload: PayloadAction<boolean>)=>{
      state.categoryModal = payload.payload
      return state;
    },
    setSelected:(state, payload: PayloadAction<string | null>) => {
      state.selected = payload.payload;
      return state;
    },
    setSession:(state, payload: PayloadAction<Session[]>)=>{
      state.session = payload.payload;
      return state;
    }
  },
});

export const { setIsDeleting, setIsCreating, setCategoryModal, setSelected, setSession } = Programme_DesignSlice.actions;
export default Programme_DesignSlice.reducer;