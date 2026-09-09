import {
  GET_USERS, GET_USERS_REQUEST, GET_USERS_ERROR, LOGIN_ERROR, LOGIN_REQUEST, LOGIN_SUCCESSFUL, LOGOUT_USER,
  REGISTER_ERROR, REGISTER_REQUEST, REGISTER_SUCCESSFUL,
} from "./auth.actionType";
import { readSession } from "./auth.session";

const initialState = () => ({
  ...readSession(),
  isError: false,
  error: "",
  isLoading: false,
  usersLoaded: false,
  user: [],
});

export const LoginReducer = (state = initialState(), { type, payload }) => {
  switch (type) {
    case GET_USERS_REQUEST:
      return { ...state, usersLoaded: false, isLoading: true, isError: false, error: "" };
    case GET_USERS_ERROR:
      return { ...state, usersLoaded: false, isLoading: false, isError: true, error: payload };
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return { ...state, isLoading: true, isError: false, error: "" };
    case LOGIN_SUCCESSFUL:
      return { ...state, isAuth: true, isLoading: false, isError: false, error: "", activeUser: payload };
    case LOGIN_ERROR:
    case REGISTER_ERROR:
      return { ...state, isLoading: false, isError: true, error: payload || "Something went wrong. Please try again." };
    case REGISTER_SUCCESSFUL:
      return { ...state, isLoading: false, isError: false, error: "", user: [...state.user, payload] };
    case GET_USERS:
      return { ...state, isLoading: false, isError: false, error: "", usersLoaded: true, user: payload };
    case LOGOUT_USER:
      return { ...state, isLoading: false, isError: false, error: "", activeUser: {}, isAuth: false };
    default:
      return state;
  }
};
