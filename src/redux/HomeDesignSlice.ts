import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState:HomeDesignStateType = {
   selected: null
}

const Home_DesignSlice = createSlice({
    name:"Home_Design",
    initialState,
    reducers:{
        setSelected:(state, payload:PayloadAction<string|null>)=>{
            state.selected = payload.payload
            return state
        }
    }
})

export const {setSelected} =Home_DesignSlice.actions
export default Home_DesignSlice.reducer;