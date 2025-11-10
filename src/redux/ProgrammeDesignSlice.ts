import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ProgrammeDesignStateType = Omit<
  HomeDesignStateType,
  "selected" | "isPublished" | "news"
> & { session: Session[], categoryModal:boolean };

const initialState: ProgrammeDesignStateType = {
  session: [],
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
    }
  },
});

export const { setIsDeleting, setIsCreating, setCategoryModal } = Programme_DesignSlice.actions;
export default Programme_DesignSlice.reducer;