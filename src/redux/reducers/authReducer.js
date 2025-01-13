import {
  LOGIN_ATTEMPT, 
  LOGIN_FAILED, 
  LOGIN_SUCCESS, 
  LOGOUT, 
  //LOGIN_CLEAN_ERROR, 
  //REGISTER_ATTEMPT, 
  //REGISTER_FAILED, 
  //REGISTER_SUCCESS 
} from "../actionTypes/authTypes";

export const authReducer = (state = { user: null, error: null, isLoading: false }, { type, payload }) => {
  switch (type) {
    case LOGIN_ATTEMPT:
      return {
        ...state,
        user: null,
        error: null,
        isLoading: true
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: payload,
        error: null,
        isLoading: false
      }
    case LOGIN_FAILED:
      return {
        ...state,
        user: null,
        error: payload,
        isLoading: false
      }
    case LOGOUT:
      return {
        ...state,
        user: null,
        error: null,
        isLoading: false,
      }
    default:
      return state;
  }
}