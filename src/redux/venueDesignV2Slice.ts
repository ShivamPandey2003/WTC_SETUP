import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
  action: string;
  Shapes: Shape[];
  selectId: string | null;
};

const initialState: initialStateType = {
  action: "SELECT",
  Shapes: [],
  selectId: null,
};

const venueDesignV2Slice = createSlice({
  name: "venueDesignV2",
  initialState,
  reducers: {
    setAction: (state, payload: PayloadAction<string>) => {
      state.action = payload.payload;
      return state;
    },
    setShapes: (state, payload: PayloadAction<Shape[]>) => {
      state.Shapes = payload.payload;
      return state;
    },
    setSelectedId: (state, payload: PayloadAction<string | null>) => {
      state.selectId = payload.payload;
      return state;
    },
  },
});

export const { setAction, setShapes, setSelectedId } =
  venueDesignV2Slice.actions;
export default venueDesignV2Slice.reducer;
