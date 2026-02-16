import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState:ModelSliceType = {
    loginModel: false,
    searchModal:false
}

const ModelSlice = createSlice({
    name:"model",
    initialState,
    reducers:{
        setLoginModel:(state, payload:PayloadAction<boolean>)=>{
            state.loginModel = payload.payload
            return state
        },
        setSearchModal:(state, payload:PayloadAction<boolean>)=>{
            state.searchModal = payload.payload
        }
    }
})

export const {setLoginModel, setSearchModal} =ModelSlice.actions
export default ModelSlice.reducer;