import {createSlice,PayloadAction } from "@reduxjs/toolkit";

interface IAccessToken{
accessToken:string |null;
}


const initialState:IAccessToken = {
    accessToken:null,
}

const AccessSlice=createSlice({
    name:'access',
    initialState,
    reducers:{
        setAccessToken:(state,action:PayloadAction<string>)=>{
            state.accessToken = action.payload;
        },
        clearAccessToken:(state)=>{

            state.accessToken=null;
        }
    }

});

export const {setAccessToken,clearAccessToken} = AccessSlice.actions;
export default AccessSlice.reducer;