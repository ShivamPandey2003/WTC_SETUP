import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
    Programme:Omit<Session, "session_id">[] 
    Venue:GlobalVenue
};

const initialState: initialStateType = {
  Programme:[],
  Venue:{
  conference_title: "",
  conference_start_date: "",
  conference_end_date: "",
  conference_location: "",
  getting_there: {
      sub_title: "",
      description: "",
      latitude: "",
      longitude: ""
    },
    floor_plan: "",
    visa_info: {
      title: "",
      sub_title: "",
      description: ""
    },
    travel_info: {
      title: "",
      description: ""
    }
}
};

const Global_Slice = createSlice({
  name: "Global_Design",
  initialState,
  reducers: {
    setProgramme: (state, payload: PayloadAction<Omit<Session, "session_id">[]>) => {
      state.Programme = payload.payload;
      return state
    },
    setVenue: (state, payload:PayloadAction<GlobalVenue>)=>{
      state.Venue = payload.payload
      return state
    }
  },
});

export const {setProgramme, setVenue} = Global_Slice.actions;
export default Global_Slice.reducer;
