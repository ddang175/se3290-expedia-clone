import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import firebase_app from "../../01_firebase/config_firebase";
import { API_BASE_URL } from "../../baseurl";
import { clearSession, publicUser, saveSession } from "./auth.session";
import {
  GET_USERS,
  GET_USERS_REQUEST,
  GET_USERS_ERROR,
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESSFUL,
  LOGOUT_USER,
  REGISTER_ERROR,
  REGISTER_REQUEST,
  REGISTER_SUCCESSFUL,
} from "./auth.actionType";

export const login_request = () => {
  return { type: LOGIN_REQUEST };
};

export const login_success = (payload) => {
  return { type: LOGIN_SUCCESSFUL, payload };
};
export const login_error = (payload) => {
  return { type: LOGIN_ERROR, payload };
};

export const register_request = () => {
  return { type: REGISTER_REQUEST };
};

export const register_success = (payload) => {
  return { type: REGISTER_SUCCESSFUL, payload };
};
export const register_error = (payload) => {
  return { type: REGISTER_ERROR, payload };
};

export const get_users = (payload) => {
  return { type: GET_USERS, payload };
};

export const handlelogout_user = () => {
  return { type: LOGOUT_USER };
};

export const userRigister = (userData) => async (dispatch) => {
  dispatch(register_request());
  try {
    const { data: existing } = await axios.get(`${API_BASE_URL}/users`, {
      params: { number: userData.number },
    });
    if (existing.length > 0) {
      throw new Error("An account already exists for this number. Please sign in.");
    }
    const { data } = await axios.post(`${API_BASE_URL}/users`, {
      ...publicUser(userData),
      role: "user",
    });
    dispatch(register_success(publicUser(data)));
    return data;
  } catch (error) {
    dispatch(register_error(error.message));
    throw error;
  }
};

// get users

export const fetch_users = async (dispatch) => {
  dispatch({ type: GET_USERS_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/users`);
    dispatch(get_users(data.map(publicUser)));
    return data;
  } catch (error) {
    dispatch({ type: GET_USERS_ERROR, payload: "Could not load accounts. Please try again." });
    return null;
  }
};

// Logint funcnality

export const login_user = (loginData, remember = false) => (dispatch) => {
  const profile = saveSession(loginData, remember);
  dispatch(login_success(profile));
  return profile;
};

export const logout_user = async (dispatch) => {
  try {
    await signOut(getAuth(firebase_app));
  } finally {
    clearSession();
    dispatch(handlelogout_user());
  }
};
