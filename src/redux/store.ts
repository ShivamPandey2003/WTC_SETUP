import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import ModelSlice from './ModalSlice'
import Home_DesignSlice from './HomeDesignSlice'
import Programme_DesignSlice from './ProgrammeDesignSlice'
import Speaker_DesignSlice from './SpeakerDesignSlice'
import Global_DesignSlice from './GlobalDesignSlice'
import Global_Slice from './GlobalSlice'
import Profile_Slice from './ProfileSlice'
import AuthSlice from './AuthSlice'
import ExhibitorSlice from './ExhibitorSlice'
import ExtraSlice from './ExtraSlice'

const persistConfig = {
  key: "root",
  storage, // localStorage
  whitelist:["Global_DesignSlice"]
};

const rootReducer = combineReducers({
  model:ModelSlice,
  Home_Design:Home_DesignSlice,
  Programme_Design:Programme_DesignSlice,
  Speaker_DesignSlice:Speaker_DesignSlice,
  Global_DesignSlice:Global_DesignSlice,
  Global_Slice:Global_Slice,
  Profile_Slice:Profile_Slice,
  AuthSlice:AuthSlice,
  ExhibitorSlice:ExhibitorSlice,
  ExtraSlice:ExtraSlice
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), // needed for redux-persist
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;