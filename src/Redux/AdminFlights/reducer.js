import {
  FLIGHT_REQUEST, FLIGHT_FAILURE, GET_FLIGHT_SUCCESS,
  POST_FLIGHT_SUCCESS, FETCH_FLIGHTS, DELETE_FLIGHTS,
} from "./actionType";

const initialState = { data: [], flight: null, isLoading: false, isError: false, error: "" };

export const FlightReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FLIGHT_REQUEST:
      return { ...state, isLoading: true, isError: false, error: "" };
    case FLIGHT_FAILURE:
      return { ...state, isLoading: false, isError: true, error: payload };
    case GET_FLIGHT_SUCCESS:
    case POST_FLIGHT_SUCCESS:
      return { ...state, isLoading: false, isError: false, error: "", flight: payload };
    case FETCH_FLIGHTS:
      return { ...state, isLoading: false, isError: false, error: "", data: payload };
    case DELETE_FLIGHTS:
      return {
        ...state, isLoading: false, isError: false, error: "",
        data: state.data.filter((item) => String(item.id) !== String(payload)),
      };
    default:
      return state;
  }
};
