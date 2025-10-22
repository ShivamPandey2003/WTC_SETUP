import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState:ModelSliceType = {
    loginModel: false
}

const ModelSlice = createSlice({
    name:"model",
    initialState,
    reducers:{
        setLoginModel:(state, payload:PayloadAction<boolean>)=>{
            state.loginModel = payload.payload
            return state
        }
    }
})

export const {setLoginModel} =ModelSlice.actions
export default ModelSlice.reducer;