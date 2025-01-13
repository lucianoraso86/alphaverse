import { login } from "../../services";
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

export const loginUser = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_ATTEMPT });

    const res = await login(username, password);
    if (res.status === 200) {
      dispatch({ type: LOGIN_SUCCESS, payload: res.data })
    } else {
      dispatch({ type: LOGIN_FAILED, payload: res.msg })
    }

  } catch (e) {
    console.error(e)
    dispatch({ type: LOGIN_FAILED, payload: null })
  }
}

export const logOutUser = () => async (dispatch) => {
  dispatch({ type: LOGOUT });
}