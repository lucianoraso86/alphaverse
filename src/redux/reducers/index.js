import { combineReducers } from "redux";

import { authReducer } from "./authReducer";
import { districtSlice } from "./../slices/districtSlice";

const rootReducer = combineReducers({
  authReducer,
  districtReducer: districtSlice.reducer,
});

export default rootReducer;
