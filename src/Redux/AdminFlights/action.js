import axios from "axios";
import { API_BASE_URL } from "../../baseurl";
import {
  FLIGHT_REQUEST, FLIGHT_FAILURE, GET_FLIGHT_SUCCESS,
  POST_FLIGHT_SUCCESS, FETCH_FLIGHTS, DELETE_FLIGHTS,
} from "./actionType";

export const getFlightSuccess = (payload) => ({ type: GET_FLIGHT_SUCCESS, payload });
export const postFlightSuccess = (payload) => ({ type: POST_FLIGHT_SUCCESS, payload });
export const flightRequest = () => ({ type: FLIGHT_REQUEST });
export const flightFailure = (payload) => ({ type: FLIGHT_FAILURE, payload });
export const fetch_flights_product = (payload) => ({ type: FETCH_FLIGHTS, payload });
export const handleDeleteProduct = (payload) => ({ type: DELETE_FLIGHTS, payload });

const flightOperation = (request, success, message) => async (dispatch) => {
  dispatch(flightRequest());
  try {
    const { data } = await request();
    dispatch(success(data));
    return data;
  } catch (error) {
    dispatch(flightFailure(message));
    throw new Error(message);
  }
};

export const addFlight = (payload) => flightOperation(
  () => axios.post(`${API_BASE_URL}/flight`, payload),
  postFlightSuccess,
  "Could not add the flight. Check the data server and try again."
);

export const updateFlight = (id, payload) => flightOperation(
  () => axios.patch(`${API_BASE_URL}/flight/${encodeURIComponent(id)}`, payload),
  postFlightSuccess,
  "Could not save the flight. Your changes have been kept; try again."
);

export const fetchFlightById = (id) => flightOperation(
  () => axios.get(`${API_BASE_URL}/flight/${encodeURIComponent(id)}`),
  getFlightSuccess,
  "Could not load this flight. It may have been removed, or the data server is unavailable."
);

export const fetchFlightProducts = () => flightOperation(
  () => axios.get(`${API_BASE_URL}/flight`),
  fetch_flights_product,
  "Could not load flights. Check the data server and try again."
);

export const DeleteFlightProducts = (id) => flightOperation(
  () => axios.delete(`${API_BASE_URL}/flight/${encodeURIComponent(id)}`),
  () => handleDeleteProduct(id),
  "Could not delete the flight. The list has not been changed; try again."
);
