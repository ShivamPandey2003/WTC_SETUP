import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
  action: string;
  map: MapT[];
  selectId: string | null;
  FloorLevelModal: boolean;
  EditFloorLevelModal: boolean;
  GlobalMap: (MapT & { programmes: (Programme&{venue_id:string})[]; created_by: string })[];
};

const initialState: initialStateType = {
  action: "SELECT",
  map: [],
  selectId: null,
  FloorLevelModal: false,
  EditFloorLevelModal: false,
  GlobalMap: [],
};

const venueDesignV2Slice = createSlice({
  name: "venueDesignV2",
  initialState,
  reducers: {
    setAction: (state, payload: PayloadAction<string>) => {
      state.action = payload.payload;
      return state;
    },
    setMap: (state, payload: PayloadAction<MapT[]>) => {
      state.map = payload.payload;
      return state;
    },
    setGlobalMap: (
      state,
      payload: PayloadAction<
        (MapT & { programmes: (Programme&{venue_id:string})[]; created_by: string })[]
      >,
    ) => {
      state.GlobalMap = payload.payload;
      return state;
    },
    setSelectedId: (state, payload: PayloadAction<string | null>) => {
      state.selectId = payload.payload;
      return state;
    },
    setFloorLevelModal: (state, payload: PayloadAction<boolean>) => {
      state.FloorLevelModal = payload.payload;
      return state;
    },
    setEditFloorLevelModal: (state, payload: PayloadAction<boolean>) => {
      state.EditFloorLevelModal = payload.payload;
      return state;
    },
  },
});

export const {
  setAction,
  setMap,
  setSelectedId,
  setFloorLevelModal,
  setEditFloorLevelModal,
  setGlobalMap,
} = venueDesignV2Slice.actions;
export default venueDesignV2Slice.reducer;
