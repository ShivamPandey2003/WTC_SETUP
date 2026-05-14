import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type initialStateT = {
    selectedFloor: string|null,
    selectedNode: string|null,
    selectedProgramme: string|null
}

const initialState:initialStateT = {
    selectedFloor:null,
    selectedNode:null,
    selectedProgramme:null
}

const MapSlice = createSlice({
    name:"Map_Slice",
    initialState,
    reducers:{
        setSelectedFloor:(state, payload: PayloadAction<string | null>)=>{
            state.selectedFloor = payload.payload
        },
        setSelectedNode:(state, payload: PayloadAction<string | null>)=>{
            state.selectedNode = payload.payload
        },
        setSelectedProgramme:(state, payload: PayloadAction<string | null>)=>{
            state.selectedProgramme = payload.payload
        },
    }
})

export const {setSelectedFloor, setSelectedNode, setSelectedProgramme} = MapSlice.actions

export default MapSlice.reducer