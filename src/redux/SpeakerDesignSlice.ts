import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ProgrammeDesignStateType = Omit<
  HomeDesignStateType,
  "isPublished" | "news"
> & { speakers: (CreateSpeakerRequest & { speaker_id: string, created_on:string })[] };

const initialState: ProgrammeDesignStateType = {
  selected: null,
  speakers: [],
  isDeleting: null,
  isCreating:false
};

const Speakers_DesignSlice = createSlice({
  name: "Speakers_Design",
  initialState,
  reducers: {
    setSelected: (state, payload: PayloadAction<string | null>) => {
      state.selected = payload.payload;
      return state;
    },
    setSpeaker: (state, payload: PayloadAction<(CreateSpeakerRequest & { speaker_id: string, created_on:string })[]>) => {
      state.speakers = payload.payload;
      return state;
    },
    setIsDeleting: (state, payload: PayloadAction<string | null>) => {
      state.isDeleting = payload.payload;
      return state;
    },
    setIsCreating:(state, payload: PayloadAction<boolean>)=>{
        state.isCreating = payload.payload
        return state;
    }
  },
});

export const { setSelected, setSpeaker, setIsDeleting, setIsCreating } = Speakers_DesignSlice.actions;
export default Speakers_DesignSlice.reducer;
